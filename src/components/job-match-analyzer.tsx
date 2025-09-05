
'use client';

import { analyzeJobMatch, type JobMatchAnalyzerOutput } from '@/ai/flows/job-match-analyzer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clipboard, FileText, Lightbulb, Loader2, Wand2, ThumbsDown, ThumbsUp, XCircle } from 'lucide-react';
import React, { useState, useTransition, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export function JobMatchAnalyzer() {
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<JobMatchAnalyzerOutput | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user?.resumeContent) {
      setResumeContent(user.resumeContent);
    }
  }, [user]);


  const handleAnalyze = () => {
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
        const payload = {
            resumeContent,
            jobDescription,
        };

        const matchResult = await analyzeJobMatch(payload);
        setResult(matchResult);

      } catch (error: any) {
        console.error('Analysis Error:', error);
        toast({
            title: 'Error',
            description: 'Failed to analyze the job match. Please try again.',
            variant: 'destructive',
        });
      }
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
             <CardDescription>
                {user ? "Your saved resume is pre-filled below. You can also paste a different one." : "Paste your resume below to get started."}
            </CardDescription>
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
             <CardDescription>
                Paste the job description to analyze your match.
            </CardDescription>
          </Header>
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
          <Button onClick={handleAnalyze} disabled={isPending || !resumeContent || !jobDescription} size="lg">
              {isPending ? <Loader2 className="animate-spin" /> : <Wand2 />}
              Analyze Job Match
          </Button>
       </div>

       {isPending && (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-muted-foreground font-semibold text-lg">Analyzing your match...</p>
                <p className="text-sm text-muted-foreground/80">This may take a moment.</p>
            </div>
        )}

      {result && !isPending && (
        <div className="space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-2xl">
                        {result.isMatch ? (
                            <><CheckCircle className="w-8 h-8 text-green-500" /> Strong Match!</>
                        ) : (
                            <><XCircle className="w-8 h-8 text-yellow-500" /> Needs Improvement</>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6 animate-in fade-in-50">
                        <div className="space-y-2">
                            <h3 className="font-semibold">Match Score</h3>
                            <Progress value={result.matchScore} indicatorClassName={getScoreColor(result.matchScore)} />
                            <p className="text-sm text-right font-medium">{result.matchScore}% Match</p>
                        </div>
                        
                        <Separator />

                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-yellow-400" /> Match Analysis
                            </h3>
                             <p className="text-sm text-muted-foreground">{result.analysis}</p>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <ThumbsUp className="w-5 h-5 text-green-500" /> Your Strengths
                                </h3>
                                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                                {result.strengths.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                                </ul>
                            </div>
                             <div className="space-y-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <ThumbsDown className="w-5 h-5 text-red-500" /> Areas to Improve
                                </h3>
                                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                                {result.weaknesses.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
