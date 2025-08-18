
'use client';

import { generateAtsFriendlyResume } from '@/ai/flows/ats-resume-generator';
import type { GenerateAtsFriendlyResumeOutput } from '@/ai/flows/ats-resume-generator';
import { extractJobDetails } from '@/ai/flows/extract-job-details';
import type { Job } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clipboard, FileText, Lightbulb, Loader2, Wand2, Download, Star } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { addDoc, collection, doc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import Link from 'next/link';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph } from 'docx';
import { saveAs } from 'file-saver';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const FREE_GENERATION_LIMIT = 3;

export function AtsResumeGenerator() {
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GenerateAtsFriendlyResumeOutput | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const canGenerate = () => {
    if (!user) return true; // Guests can always try
    if (user.subscriptionStatus === 'active') return true;
    
    const today = new Date().toISOString().split('T')[0];
    if (user.lastGenerationDate !== today) {
        return true; // First generation of the day
    }
    
    return (user.generationsToday || 0) < FREE_GENERATION_LIMIT;
  }

  const handleGenerate = () => {
    if (!resumeContent.trim() || !jobDescription.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please paste both your resume and the job description.',
        variant: 'destructive',
      });
      return;
    }

    if (!canGenerate()) {
        setShowUpgradeDialog(true);
        return;
    }


    startTransition(async () => {
      const isRegeneration = !!result;
      
      try {
        const payload = {
            resumeContent,
            jobDescription,
            previousAttempt: isRegeneration
              ? {
                  resume: result.atsFriendlyResume,
                  score: result.atsScore,
                }
              : undefined,
          };

        if (user) {
            const [atsResult, jobDetails] = await Promise.all([
               generateAtsFriendlyResume(payload),
               extractJobDetails({ jobDescription })
            ]);
    
            setResult(atsResult);

            // Update user generation count
            const userRef = doc(firestore, 'users', user.uid);
            const today = new Date().toISOString().split('T')[0];
            if (user.lastGenerationDate === today) {
                await updateDoc(userRef, { generationsToday: increment(1) });
            } else {
                await updateDoc(userRef, { generationsToday: 1, lastGenerationDate: today });
            }
    
            if (jobDetails.companyName && jobDetails.jobTitle) {
              const newJob: Omit<Job, 'id'> = {
                userId: user.uid,
                ...jobDetails,
                status: 'Saved',
                applicationDate: new Date().toISOString(),
                notes: 'Generated an ATS-friendly resume for this application.',
                jobDescription: jobDescription,
              };
              
              await addDoc(collection(firestore, 'jobs'), newJob);
              
              window.dispatchEvent(new Event('jobAdded'));
              
              toast({
                title: 'Job Tracked!',
                description: `${jobDetails.jobTitle} at ${jobDetails.companyName} has been added to your list.`,
              });
            } else {
                 toast({
                    title: 'Could Not Track Job',
                    description: 'The AI could not extract job details to track, but the resume was generated.',
                    variant: 'destructive',
                });
            }
        } else {
            // Unauthenticated user flow
            const atsResult = await generateAtsFriendlyResume(payload);
            setResult(atsResult);
            toast({
                title: 'Resume Generated!',
                description: (
                    <p>
                        Your resume is ready. Want to save and track this job?{' '}
                        <Link href="/signup" className="underline font-bold">Sign up for free</Link>.
                    </p>
                )
            });
        }

      } catch (error) {
        console.error('Generation Error:', error);
        toast({
          title: 'Error',
          description: 'Failed to generate the resume or track the job. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard',
      description: 'The rewritten resume has been copied to your clipboard.',
    });
  };

  const handleDownloadPdf = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFont('Inter', 'normal');
    doc.setFontSize(11);
    const text = result.atsFriendlyResume;
    const lines = doc.splitTextToSize(text, 180); // 180 is the width of the text area in mm
    doc.text(lines, 15, 20);
    doc.save('ResuAI-Optimized-Resume.pdf');
  };

  const handleDownloadDocx = () => {
    if (!result) return;
    const textParagraphs = result.atsFriendlyResume.split('\n').map(
        (text) => new Paragraph({ text })
    );

    const doc = new Document({
        sections: [{
            properties: {},
            children: textParagraphs,
        }],
    });

    Packer.toBlob(doc).then(blob => {
        saveAs(blob, 'ResuAI-Optimized-Resume.docx');
    });
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score > 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  const generationsLeft = user && user.subscriptionStatus === 'free'
    ? FREE_GENERATION_LIMIT - (user.generationsToday || 0)
    : null;

  return (
    <div className="flex flex-col gap-8">
      {user && user.subscriptionStatus === 'free' && (
        <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
                <CardTitle className="text-yellow-800">Free Plan</CardTitle>
                <CardDescription className="text-yellow-700">
                    You have {generationsLeft} generations left today. {' '}
                    <Link href="/pricing" className="underline font-bold">Upgrade for unlimited generations.</Link>
                </CardDescription>
            </CardHeader>
        </Card>
      )}

       <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>You've reached your daily limit</AlertDialogTitle>
            <AlertDialogDescription>
                Free users can generate up to {FREE_GENERATION_LIMIT} resumes per day. Please upgrade to a premium plan for unlimited access.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogAction asChild>
                <Link href="/pricing">
                    <Star className="mr-2 h-4 w-4" /> Upgrade
                </Link>
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6" /> Your Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your current resume here..."
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
              rows={15}
              className="text-sm"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clipboard className="w-6 h-6" /> Job Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste the target job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={15}
              className="text-sm"
            />
          </CardContent>
        </Card>
      </div>

       {!result && (
         <div className="flex justify-center mt-6">
            <Button onClick={handleGenerate} disabled={isPending || !resumeContent || !jobDescription} size="lg">
                {isPending ? <Loader2 className="animate-spin" /> : <Wand2 />}
                {user ? 'Generate & Track' : 'Generate Resume'}
            </Button>
         </div>
        )}

      <div className="space-y-6 mt-8">
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wand2 className="w-6 h-6 text-primary" /> AI Generated Result
                </CardTitle>
            </CardHeader>
            <CardContent>
            {isPending && (
                <div className="flex flex-col items-center justify-center h-96 space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Analyzing, rewriting, and tracking...</p>
                    <p className="text-sm text-muted-foreground/80">This may take a moment.</p>
                </div>
            )}
            {!isPending && !result && (
                 <div className="flex flex-col items-center justify-center h-96 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">
                        Your optimized resume will appear here once generated.
                    </p>
                </div>
            )}

            {result && (
                <div className="space-y-6 animate-in fade-in-50">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                         <Button onClick={() => copyToClipboard(result.atsFriendlyResume)} className="w-full">
                            <Clipboard className="mr-2 h-4 w-4" /> Copy Resume
                        </Button>
                        <Button onClick={handleDownloadPdf} className="w-full" variant="outline">
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                        </Button>
                        <Button onClick={handleDownloadDocx} className="w-full" variant="outline">
                            <Download className="mr-2 h-4 w-4" /> Download DOCX
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold">ATS Compatibility Score</h3>
                        <Progress value={result.atsScore} indicatorClassName={getScoreColor(result.atsScore)} />
                        <p className="text-sm text-right font-medium">{result.atsScore}% ({result.scoreAnalysis})</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-400" /> Key Improvements
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                        {result.keyImprovements.map((item, index) => (
                            <li key={index} className="flex items-start">
                                <CheckCircle className="w-4 h-4 mr-2 mt-1 text-green-500 flex-shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                    
                    <Separator />

                    <div>
                        <h3 className="font-semibold mb-2">Optimized Resume</h3>
                        <Textarea
                            readOnly
                            value={result.atsFriendlyResume}
                            className="h-[400px] bg-muted/50 text-sm"
                        />
                    </div>
                     <Button onClick={handleGenerate} disabled={isPending || !resumeContent || !jobDescription} className="w-full">
                        {isPending ? <Loader2 className="animate-spin" /> : <Wand2 />}
                         {user ? 'Regenerate & Improve' : 'Regenerate & Improve'}
                    </Button>
                </div>
            )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
