
'use client';

import { generateAtsFriendlyResume } from '@/ai/flows/ats-resume-generator';
import type { GenerateAtsFriendlyResumeOutput } from '@/ai/flows/ats-resume-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clipboard, FileText, Lightbulb, Loader2, Wand2 } from 'lucide-react';
import React, { useState, useTransition } from 'react';

export function AtsResumeGenerator() {
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GenerateAtsFriendlyResumeOutput | null>(null);
  const { toast } = useToast();

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
      try {
        const output = await generateAtsFriendlyResume({
          resumeContent,
          jobDescription,
        });
        setResult(output);
      } catch (error) {
        console.error('Generation Error:', error);
        toast({
          title: 'Error',
          description: 'Failed to generate the resume. Please try again.',
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
  
  const getScoreColor = (score: number) => {
    if (score > 85) return 'bg-green-500';
    if (score > 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
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

      <div className="space-y-6">
         <div className="sticky top-24">
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
                        <p className="text-muted-foreground">Analyzing and rewriting your resume...</p>
                        <p className="text-sm text-muted-foreground/80">This may take a moment.</p>
                    </div>
                )}
                {!isPending && !result && (
                     <div className="flex flex-col items-center justify-center h-96 text-center">
                        <FileText className="w-12 h-12 text-muted-foreground/50" />
                        <p className="mt-4 text-muted-foreground">
                            Your optimized resume will appear here once generated.
                        </p>
                         <Button onClick={handleGenerate} disabled={isPending || !resumeContent || !jobDescription} size="lg" className="mt-6">
                            {isPending ? <Loader2 className="animate-spin" /> : <Wand2 />}
                            Generate Resume
                        </Button>
                    </div>
                )}

                {result && (
                    <div className="space-y-6 animate-in fade-in-50">
                        <div>
                             <Button onClick={() => copyToClipboard(result.atsFriendlyResume)} className="w-full">
                                <Clipboard className="mr-2 h-4 w-4" /> Copy Resume Text
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
                    </div>
                )}
                </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
