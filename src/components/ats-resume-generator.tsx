
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
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, TabStopType, TabStopPosition, ISpacingProperties, convertInchesToTwip } from 'docx';
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

export function AtsResumeGenerator() {
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GenerateAtsFriendlyResumeOutput | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleGenerate = () => {
    if (!resumeContent.trim() || !jobDescription.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please paste both your resume and the job description.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      setResult(null);
      const isRegeneration = !!result;
      
      try {
        const payload = {
            resumeContent,
            jobDescription,
            previousAttempt: isRegeneration
              ? {
                  resume: result.atsFriendlyResumeText,
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
    
            const newJob: Omit<Job, 'id'> = {
              userId: user.uid,
              companyName: jobDetails.companyName || '',
              jobTitle: jobDetails.jobTitle || '',
              location: jobDetails.location || '',
              status: 'Saved',
              applicationDate: new Date().toISOString(),
              notes: 'Generated an ATS-friendly resume for this application.',
              jobDescription: jobDescription,
            };
            
            await addDoc(collection(firestore, 'jobs'), newJob);
            
            window.dispatchEvent(new Event('jobAdded'));
            
            if (jobDetails.companyName && jobDetails.jobTitle) {
                 toast({
                    title: 'Job Tracked!',
                    description: `${jobDetails.jobTitle} at ${jobDetails.companyName} has been added to your list.`,
                });
            } else {
                toast({
                    title: 'Job Tracked!',
                    description: 'We saved the job, but please add the company name and title manually.',
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

      } catch (error: any) {
        console.error('Generation Error:', error);
        if (error.message && (error.message.includes('503') || error.message.includes('overloaded'))) {
             toast({
                title: 'AI Service Unavailable',
                description: 'The AI model is currently overloaded. Please try again in a few moments.',
                variant: 'destructive',
            });
        } else {
            toast({
              title: 'Error',
              description: 'Failed to generate the resume or track the job. Please try again.',
              variant: 'destructive',
            });
        }
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

  const handleDownloadDocx = async () => {
    if (!result?.atsFriendlyResume) return;

    const { personalDetails, sections } = result.atsFriendlyResume;
    
    const docChildren: Paragraph[] = [];

    if (personalDetails.name) {
        docChildren.push(new Paragraph({
            children: [new TextRun({ text: personalDetails.name.toUpperCase(), bold: true, size: 32 })], // 16pt
            alignment: AlignmentType.CENTER,
            spacing: { after: 0 },
        }));
    }
    const contactInfo = [personalDetails.email, personalDetails.phone, personalDetails.linkedin].filter(Boolean).join(' | ');
    if (contactInfo) {
        docChildren.push(new Paragraph({
            children: [new TextRun({ text: contactInfo, size: 20 })], // 10pt
            alignment: AlignmentType.CENTER,
            spacing: { after: 200, line: 240 },
        }));
    }

    sections.forEach(section => {
        docChildren.push(new Paragraph({
            children: [new TextRun({ text: section.heading.toUpperCase(), bold: true, size: 22 })], // 11pt
            spacing: { before: 100, after: 50 },
        }));

        section.content.forEach(item => {
            switch (item.type) {
                case 'paragraph':
                    docChildren.push(new Paragraph({
                        children: [new TextRun({ text: item.text, size: 21 })], // 10.5pt
                        spacing: { after: 100, line: 240 },
                    }));
                    break;
                case 'subheading':
                     const [leftText, rightText] = item.text.split('||');
                    docChildren.push(new Paragraph({
                        children: [
                            new TextRun({ text: leftText.trim(), bold: true, size: 21 }), // 10.5pt
                            new TextRun({ text: `\t${rightText ? rightText.trim() : ''}`, bold: true, size: 21 })
                        ],
                        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                         spacing: { after: 0, before: 80, line: 240 },
                    }));
                    break;
                case 'detail':
                    docChildren.push(new Paragraph({
                        children: [new TextRun({ text: item.text, italics: true, size: 21 })], // 10.5pt
                        spacing: { after: 100, before: 0, line: 240 },
                    }));
                    break;
                case 'bullet':
                    docChildren.push(new Paragraph({
                        text: item.text,
                        bullet: { level: 0 },
                        style: "default",
                        indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.25) },
                        spacing: { after: 60, line: 240 },
                    }));
                    break;
            }
        });
    });

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: convertInchesToTwip(0.6),
                        right: convertInchesToTwip(0.6),
                        bottom: convertInchesToTwip(0.6),
                        left: convertInchesToTwip(0.6),
                    },
                },
            },
            children: docChildren,
        }],
        styles: {
            default: {
                document: {
                    run: { font: "Times New Roman", size: 21 }, // 10.5pt default
                    paragraph: {
                        spacing: { line: 240, before: 0, after: 0 }, // 1.0 line spacing
                    }
                },
            },
            paragraphStyles: [{
                id: "default",
                name: "Default",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: { font: "Times New Roman", size: 21 },
                paragraph: {
                    spacing: { line: 240, before: 0, after: 60 }
                }
            }]
        }
    });

    Packer.toBlob(doc).then(blob => {
        saveAs(blob, 'Crackresume-Optimized-Resume.docx');
    });
};
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score > 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  return (
    <div className="flex flex-col gap-8">
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

       <div className="flex justify-center my-4">
          <Button onClick={handleGenerate} disabled={isPending || !resumeContent || !jobDescription} size="lg">
              {isPending ? <Loader2 className="animate-spin" /> : <Wand2 />}
              {result ? (user ? 'Regenerate & Track' : 'Regenerate Resume') : (user ? 'Generate & Track' : 'Generate Resume')}
          </Button>
       </div>

      <div className="space-y-6">
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

            {result && !isPending && (
                <div className="space-y-6 animate-in fade-in-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                         <Button onClick={() => copyToClipboard(result.atsFriendlyResumeText)} className="w-full">
                            <Clipboard className="mr-2 h-4 w-4" /> Copy Resume
                        </Button>
                        <Button onClick={handleDownloadDocx} className="w-full">
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
                            value={result.atsFriendlyResumeText}
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

    