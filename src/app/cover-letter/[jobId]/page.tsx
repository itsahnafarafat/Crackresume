
'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import type { Job } from '@/lib/types';
import { Header } from '@/components/shared/header';
import { Loader2, Wand2, Clipboard as ClipboardIcon, FileText, Briefcase, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateCoverLetter } from '@/ai/flows/cover-letter-generator';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export default function CoverLetterPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { jobId } = params;
  const { toast } = useToast();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [coverLetter, setCoverLetter] = useState<string>('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    if (!jobId || typeof jobId !== 'string') {
        toast({ title: 'Error', description: 'Invalid job ID.', variant: 'destructive'});
        router.push('/dashboard');
        return;
    }

    const fetchJob = async () => {
      try {
        const jobDocRef = doc(firestore, 'jobs', jobId);
        const jobDoc = await getDoc(jobDocRef);

        if (jobDoc.exists() && jobDoc.data().userId === user.uid) {
          setJob({ id: jobDoc.id, ...jobDoc.data() } as Job);
        } else {
          toast({ title: 'Error', description: 'Job not found or access denied.', variant: 'destructive'});
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast({ title: 'Error', description: 'Failed to fetch job details.', variant: 'destructive'});
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [user, authLoading, jobId, router, toast]);

  const handleGenerate = () => {
    if (!user?.resumeContent || !job?.jobDescription) {
        toast({
            title: "Missing Information",
            description: "A saved resume and job description are required to generate a cover letter.",
            variant: 'destructive',
        });
        return;
    }

    startTransition(async () => {
        try {
            const result = await generateCoverLetter({
                resumeContent: user.resumeContent!,
                jobDescription: job.jobDescription!,
                companyName: job.companyName,
                jobTitle: job.jobTitle,
            });
            setCoverLetter(result.coverLetter);
            toast({ title: 'Success!', description: 'Your custom cover letter has been generated.'});
        } catch (error) {
            console.error("Cover letter generation error:", error);
            toast({ title: 'Error', description: 'Failed to generate cover letter.', variant: 'destructive'});
        }
    });
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard',
      description: 'The cover letter has been copied to your clipboard.',
    });
  };

  const handleDownloadDocx = async () => {
    if (!coverLetter) return;

    const paragraphs = coverLetter.split('\n').map(text => 
        new Paragraph({
            children: [new TextRun(text)],
            spacing: { after: 120 }
        })
    );

    const doc = new Document({
        sections: [{
            children: paragraphs
        }],
         styles: {
            default: {
                document: {
                    run: { font: "Calibri", size: 22 },
                },
            },
        }
    });

    Packer.toBlob(doc).then(blob => {
        saveAs(blob, 'Crackresume-Cover-Letter.docx');
    });
  };

  if (loading || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-12">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Cover Letter Generator
                </h1>
                <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                    Generate a personalized cover letter for your job application at <span className="font-semibold text-primary">{job?.companyName}</span>.
                </p>
            </div>
            
            <div className="mx-auto max-w-7xl mt-12 space-y-8">
                {/* Top Row: Data */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Briefcase/> Job Description</CardTitle>
                             <CardDescription>{job?.jobTitle}</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Textarea
                                readOnly
                                value={job?.jobDescription || 'No job description available.'}
                                className="h-96 bg-muted/50 text-sm"
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FileText/> Your Resume</CardTitle>
                             <CardDescription>This will be used to generate the cover letter.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                readOnly
                                value={user?.resumeContent || 'No resume saved. Please add one in your dashboard.'}
                                className="h-96 bg-muted/50 text-sm"
                            />
                        </CardContent>
                    </Card>
                </div>
                 {/* Bottom Row: Generator */}
                <div>
                    <Card>
                         <CardHeader>
                            <CardTitle>Your Custom Cover Letter</CardTitle>
                            <CardDescription>Click the button below to create your letter. It will appear in the text box.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <Button onClick={handleGenerate} disabled={isPending || !user?.resumeContent || !job?.jobDescription} size="lg" className="w-full">
                                {isPending ? <Loader2 className="animate-spin" /> : <Wand2 />}
                                {isPending ? 'Generating...' : 'Generate Cover Letter'}
                            </Button>
                            <Textarea
                                readOnly={isPending}
                                value={coverLetter}
                                placeholder={isPending ? "Generating your cover letter..." : "Your generated cover letter will appear here..."}
                                className="h-96 bg-muted/50 text-sm"
                            />
                            {coverLetter && !isPending && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <Button onClick={() => copyToClipboard(coverLetter)} className="w-full">
                                        <ClipboardIcon className="mr-2 h-4 w-4" /> Copy Letter
                                    </Button>
                                    <Button onClick={handleDownloadDocx} className="w-full">
                                        <Download className="mr-2 h-4 w-4" /> Download .DOCX
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
