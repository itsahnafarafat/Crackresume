'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Loader2, Clipboard, Check, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateAtsFriendlyResume, GenerateAtsFriendlyResumeOutput } from '@/ai/flows/ats-resume-generator';
import { Progress } from '@/components/ui/progress';

export function AtsFriendlyResumeGenerator() {
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [generationResult, setGenerationResult] = useState<GenerateAtsFriendlyResumeOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!resumeContent.trim() || !jobDescription.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both your resume content and a job description.',
        variant: 'destructive',
      });
      return;
    }

    setGenerationResult(null); // Clear previous results

    startTransition(async () => {
      try {
        const result = await generateAtsFriendlyResume({ resumeContent, jobDescription });
        setGenerationResult(result);
      } catch (error) {
         console.error('Generate ATS Friendly Resume Error:', error);
        toast({
          title: 'Error',
          description: 'Failed to generate the ATS-friendly resume.',
          variant: 'destructive',
        });
      }
    });
  };
  
  const handleCopy = () => {
    if (generationResult) {
      navigator.clipboard.writeText(generationResult.atsFriendlyResume);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };


  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
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
                 <Button onClick={handleGenerate} disabled={isPending} size="lg">
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
                    <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isPending}>
                        <RefreshCw className="h-4 w-4" />
                        <span className="ml-2">Regenerate</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {hasCopied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                      <span className="ml-2">{hasCopied ? 'Copied!' : 'Copy'}</span>
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Review the generated resume below. You can copy it and paste it into your document editor.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                    <Label className="text-base font-semibold">ATS Compatibility Score</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative h-24 w-24">
                        <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36">
                          <circle className="text-secondary" strokeWidth="4" cx="18" cy="18" r="16" fill="none"></circle>
                          <circle className="text-primary" strokeWidth="4" strokeDasharray={`${generationResult.atsScore}, 100`} cx="18" cy="18" r="16" fill="none" strokeLinecap="round" transform="rotate(-90 18 18)"></circle>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">{generationResult.atsScore}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground italic flex-1">
                        {generationResult.feedback}
                      </p>
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
