'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, Loader2, Clipboard, Check } from 'lucide-react';
import { runGenerateAtsFriendlyResume } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { generateAtsFriendlyResume } from '@/ai/flows/ats-resume-generator';

export function AtsFriendlyResumeGenerator() {
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [generatedResume, setGeneratedResume] = useState('');
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

    startTransition(async () => {
      try {
        const result = await generateAtsFriendlyResume({ resumeContent, jobDescription });
        setGeneratedResume(result.atsFriendlyResume);
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
    navigator.clipboard.writeText(generatedResume);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
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

          {generatedResume && !isPending && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Your New ATS-Friendly Resume
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {hasCopied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                    <span className="ml-2">{hasCopied ? 'Copied!' : 'Copy'}</span>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Review the generated resume below. You can copy it and paste it into your document editor.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  readOnly
                  value={generatedResume}
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
