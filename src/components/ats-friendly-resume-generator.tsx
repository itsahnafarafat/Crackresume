'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Loader2, Clipboard, Check, RefreshCw, Download, TrendingUp, AlertCircle, CheckCircle, PencilLine, ListChecks, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateAtsFriendlyResume, GenerateAtsFriendlyResumeOutput } from '@/ai/flows/ats-resume-generator';
import { extractJobDetails, ExtractJobDetailsOutput } from '@/ai/flows/extract-job-details';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import jsPDF from 'jspdf';
import type { Job } from '@/lib/types';


export function AtsFriendlyResumeGenerator() {
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [generationResult, setGenerationResult] = useState<GenerateAtsFriendlyResumeOutput | null>(null);
  const [jobDetailsForTracking, setJobDetailsForTracking] = useState<(ExtractJobDetailsOutput & { jobDescription: string }) | null>(null);
  const [isJobTracked, setIsJobTracked] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const handleGenerate = (isRegeneration = false) => {
    if (!resumeContent.trim() || !jobDescription.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both your resume content and a job description.',
        variant: 'destructive',
      });
      return;
    }
    
    let previousAttempt;
    if (isRegeneration && generationResult) {
       previousAttempt = {
         resume: generationResult.atsFriendlyResume,
         score: generationResult.atsScore,
         feedback: generationResult.scoreAnalysis,
       };
    } else {
        setGenerationResult(null); // Clear previous results only on first generation
    }
    
    setIsJobTracked(false); // Reset tracked state for new generation

    startTransition(async () => {
      try {
        const [result, jobDetails] = await Promise.all([
            generateAtsFriendlyResume({ resumeContent, jobDescription, previousAttempt }),
            extractJobDetails({ jobDescription }),
        ]);

        setGenerationResult(result);
        if (jobDetails.companyName && jobDetails.jobTitle) {
            setJobDetailsForTracking({ ...jobDetails, jobDescription });
        } else {
            setJobDetailsForTracking(null);
        }

      } catch (error) {
         console.error('Generate ATS Friendly Resume Error:', error);
        toast({
          title: 'Error',
          description: 'Failed to process the request. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  const handleTrackJob = () => {
    if (jobDetailsForTracking) {
      const newJob: Job = {
        id: crypto.randomUUID(),
        ...jobDetailsForTracking,
        status: 'Applied',
        applicationDate: new Date().toISOString(),
        notes: `Generated ATS resume. Score: ${generationResult?.atsScore}.`,
      };
      const currentJobs: Job[] = JSON.parse(localStorage.getItem('jobs') || '[]');
      localStorage.setItem('jobs', JSON.stringify([newJob, ...currentJobs]));
      window.dispatchEvent(new Event('storage')); // Notify other components of the change
      setIsJobTracked(true);
       toast({
        title: 'Job Tracked!',
        description: `${jobDetailsForTracking.jobTitle} at ${jobDetailsForTracking.companyName} has been added to your tracker.`,
      });
    }
  };
  
  const handleCopy = () => {
    if (generationResult) {
      navigator.clipboard.writeText(generationResult.atsFriendlyResume);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (generationResult) {
      const doc = new jsPDF();
      const margin = 15;
      const pageWidth = doc.internal.pageSize.getWidth();
      const text = doc.splitTextToSize(generationResult.atsFriendlyResume, pageWidth - margin * 2);
      doc.text(text, margin, margin);
      doc.save('ats-friendly-resume.pdf');
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return 'bg-red-500';
    if (score < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getScoreIcon = (score: number) => {
    if (score < 40) return <AlertCircle className="h-5 w-5 text-red-500" />;
    if (score < 75) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  }

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Generate Your ATS-Friendly Resume
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Paste your current resume and the job description below. Our AI will rewrite your resume to be optimized for Applicant Tracking Systems (ATS).
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl mt-12">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="resume-content" className="text-lg font-semibold">Your Resume</Label>
                  <Textarea
                    id="resume-content"
                    placeholder="Paste your entire resume here..."
                    value={resumeContent}
                    onChange={(e) => setResumeContent(e.target.value)}
                    rows={15}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-description" className="text-lg font-semibold">Job Description</Label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the full job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={15}
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                 <Button onClick={() => handleGenerate()} disabled={isPending} size="lg">
                    {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Bot className="mr-2 h-5 w-5" />}
                    Generate Resume
                  </Button>
              </div>
            </CardContent>
          </Card>
          
           {isPending && (
             <Card className="mt-8">
                <CardContent className="p-6 flex flex-col items-center justify-center gap-4 text-center">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <p className="text-muted-foreground">Our AI is crafting your new resume... This may take a moment.</p>
                </CardContent>
             </Card>
           )}

          {generationResult && !isPending && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  Your New ATS-Friendly Resume
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleGenerate(true)} disabled={isPending}>
                        <RefreshCw className="h-4 w-4" />
                        <span className="ml-2 hidden sm:inline">Regenerate</span>
                    </Button>
                     <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4" />
                      <span className="ml-2 hidden sm:inline">Download</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {hasCopied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                      <span className="ml-2 hidden sm:inline">{hasCopied ? 'Copied!' : 'Copy'}</span>
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Review the generated resume and the analysis below. You can copy or download the result.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="p-4 border rounded-lg space-y-4">
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-semibold flex items-center gap-2'><TrendingUp className="h-5 w-5 text-primary" /> ATS Compatibility Score</h3>
                    <div className="flex items-center gap-4">
                        {jobDetailsForTracking && (
                            <Button variant="secondary" size="sm" onClick={handleTrackJob} disabled={isJobTracked}>
                                <PlusCircle className="h-4 w-4" />
                                <span className="ml-2 hidden sm:inline">{isJobTracked ? 'Job Tracked' : 'Add to Tracker'}</span>
                            </Button>
                        )}
                        <span className='text-2xl font-bold text-primary'>{generationResult.atsScore}%</span>
                    </div>
                  </div>
                  <Progress value={generationResult.atsScore} className="h-2 [&>div]:bg-primary" indicatorClassName={getScoreColor(generationResult.atsScore)} />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2"><PencilLine className="h-5 w-5 text-muted-foreground" /> Score Analysis</h4>
                         <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2">
                          {getScoreIcon(generationResult.atsScore)}
                           <p className='flex-1'>{generationResult.scoreAnalysis}</p>
                        </div>
                      </div>
                       <div>
                        <h4 className="font-semibold flex items-center gap-2"><ListChecks className="h-5 w-5 text-muted-foreground" /> Key Improvements</h4>
                         <ScrollArea className="h-24 mt-2">
                          <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                           {generationResult.keyImprovements.map((item, index) => <li key={index}>{item}</li>)}
                          </ul>
                        </ScrollArea>
                      </div>
                   </div>
                </div>


                <Textarea
                  readOnly
                  value={generationResult.atsFriendlyResume}
                  className="bg-secondary/50 h-96 text-sm"
                  rows={20}
                />
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </section>
  );
}
