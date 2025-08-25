
'use client';

import { generateAtsFriendlyResume } from '@/ai/flows/ats-resume-generator';
import type { GenerateAtsFriendlyResumeOutput } from '@/ai/flows/ats-resume-generator';
import { extractJobDetails } from '@/ai/flows/extract-job-details';
import type { Job, StructuredResume } from '@/lib/types';
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
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, HorizontalRule, TabStopType, TabStopPosition, PageBreak, convertInchesToTwip } from 'docx';
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

      } catch (error: any) {
        console.error('Generation Error:', error);
        if (error.message && error.message.includes('503 Service Unavailable')) {
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

 const handleDownloadPdf = () => {
    if (!result?.atsFriendlyResume) return;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFont('times', 'normal');

    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - margin * 2;
    let y = margin;
    const lineHeight = 1.15;
    const smallFontSize = 9;
    const normalFontSize = 10.5;
    const subheadingFontSize = 11;
    const headingFontSize = 12;
    const nameFontSize = 24;

    const addText = (text: string, x: number, currentY: number, options: { isBold?: boolean; size?: number; align?: 'center' | 'left' | 'right'; color?: string } = {}) => {
        if (!text) return currentY;
        doc.setFontSize(options.size || normalFontSize);
        doc.setFont('times', options.isBold ? 'bold' : 'normal');
        if (options.color) doc.setTextColor(options.color);

        const textWidth = doc.getStringUnitWidth(text) * (options.size || normalFontSize) / doc.internal.scaleFactor;
        let textX = x;
        if (options.align === 'center') textX = pageWidth / 2;
        if (options.align === 'right') textX = pageWidth - margin;

        doc.text(text, textX, currentY, { align: options.align || 'left', baseline: 'top' });
        doc.setTextColor('#000000');
        return currentY;
    };

    const addLine = (currentY: number) => {
        const newY = currentY;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.75);
        doc.line(margin, newY, pageWidth - margin, newY);
        return newY + 12; 
    }

    const { personalDetails, sections } = result.atsFriendlyResume;

    // --- Header ---
    if (personalDetails.name) {
        addText(personalDetails.name.toUpperCase(), pageWidth / 2, y, { size: nameFontSize, isBold: true, align: 'center' });
        y += nameFontSize * 0.9;
    }
    const contactInfo = [personalDetails.email, personalDetails.phone, personalDetails.linkedin].filter(Boolean).join(' | ');
    if (contactInfo) {
        addText(contactInfo, pageWidth / 2, y, { size: smallFontSize, align: 'center' });
        y += smallFontSize * lineHeight + 15;
    }

    // --- Sections ---
    sections.forEach(section => {
        if (y > doc.internal.pageSize.getHeight() - margin * 2) return;

        addText(section.heading.toUpperCase(), margin, y, { size: headingFontSize, isBold: true });
        y += headingFontSize * lineHeight - 4;
        y = addLine(y);

        section.content.forEach(item => {
            if (y > doc.internal.pageSize.getHeight() - margin) return;

            switch (item.type) {
                case 'paragraph':
                    const paraLines = doc.splitTextToSize(item.text, usableWidth);
                    doc.setFontSize(normalFontSize);
                    doc.text(paraLines, margin, y);
                    y += paraLines.length * normalFontSize * lineHeight;
                    y += 5;
                    break;
                case 'subheading':
                    const [leftText, rightText] = item.text.split('||');
                    addText(leftText.trim(), margin, y, { size: subheadingFontSize, isBold: true });
                    if(rightText) addText(rightText.trim(), 0, y, { size: subheadingFontSize, isBold: true, align: 'right' });
                    y += subheadingFontSize * lineHeight;
                    break;
                case 'detail':
                    doc.setFontSize(smallFontSize);
                    doc.setFont('times', 'italic');
                    doc.text(item.text, margin, y);
                    doc.setFont('times', 'normal');
                    y += smallFontSize * lineHeight;
                    y += 5;
                    break;
                case 'bullet':
                    const bulletLines = doc.splitTextToSize(item.text, usableWidth - 20);
                    addText('•', margin + 5, y, { size: normalFontSize });
                    doc.setFontSize(normalFontSize);
                    doc.text(bulletLines, margin + 20, y);
                    y += bulletLines.length * normalFontSize * lineHeight;
                    y += 2;
                    break;
            }
        });
        y += 10;
    });

    doc.save('Crackresume-Optimized-Resume.pdf');
  };
  
  const handleDownloadDocx = async () => {
    if (!result?.atsFriendlyResume) return;

    const { personalDetails, sections } = result.atsFriendlyResume;

    const docChildren: Paragraph[] = [];

    // --- Header ---
    if (personalDetails.name) {
        docChildren.push(new Paragraph({
            children: [new TextRun({ text: personalDetails.name.toUpperCase(), bold: true, size: 48 })], // 24pt
            alignment: AlignmentType.CENTER,
            spacing: { after: 0 },
        }));
    }
    const contactInfo = [personalDetails.email, personalDetails.phone, personalDetails.linkedin].filter(Boolean).join(' | ');
    if (contactInfo) {
        docChildren.push(new Paragraph({
            children: [new TextRun({ text: contactInfo, size: 18 })], // 9pt
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
        }));
    }

    // --- Sections ---
    sections.forEach(section => {
        docChildren.push(new Paragraph({
            children: [new TextRun({ text: section.heading.toUpperCase(), bold: true, size: 24 })], // 12pt
            spacing: { after: 80 },
            border: { bottom: { color: "auto", space: 6, value: "single", size: 6 } },
        }));

        section.content.forEach(item => {
            switch (item.type) {
                case 'paragraph':
                    docChildren.push(new Paragraph({
                        children: [new TextRun({ text: item.text, size: 21 })], // 10.5pt
                        spacing: { after: 100 },
                    }));
                    break;
                case 'subheading':
                    const [leftText, rightText] = item.text.split('||');
                    docChildren.push(new Paragraph({
                        children: [
                            new TextRun({ text: leftText.trim(), bold: true, size: 22 }), // 11pt
                            new TextRun({ text: `\t${rightText ? rightText.trim() : ''}`, bold: true, size: 22 })
                        ],
                        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }]
                    }));
                    break;
                case 'detail':
                    docChildren.push(new Paragraph({
                        children: [new TextRun({ text: item.text, italics: true, size: 21 })], // 10.5pt
                        spacing: { after: 100 },
                    }));
                    break;
                case 'bullet':
                    docChildren.push(new Paragraph({
                        text: item.text,
                        bullet: { level: 0 },
                        style: "default",
                        indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.25) },
                        spacing: { after: 40 },
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
                        top: convertInchesToTwip(0.7),
                        right: convertInchesToTwip(0.7),
                        bottom: convertInchesToTwip(0.7),
                        left: convertInchesToTwip(0.7),
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
                        spacing: { line: 276, before: 0, after: 160 }, // 1.15 line spacing, 8pt after
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
                    spacing: { line: 276, before: 0, after: 80 }
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                         <Button onClick={() => copyToClipboard(result.atsFriendlyResumeText)} className="w-full">
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
