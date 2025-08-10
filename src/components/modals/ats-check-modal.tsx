'use client';
import React, { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScanLine, Loader2, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { runAtsCheck } from '@/lib/actions';
import type { ResumeData } from '@/lib/types';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '@/hooks/use-toast';

interface AtsCheckModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  resumeData: ResumeData;
}

interface AtsResult {
  score: number;
  feedback: string;
  suggestions: string;
}

export function AtsCheckModal({ isOpen, onOpenChange, resumeData }: AtsCheckModalProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<AtsResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleCheck = () => {
     if (!jobDescription.trim()) {
      toast({
        title: 'Job Description Required',
        description: 'Please paste a job description for an accurate ATS analysis.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      const response = await runAtsCheck(resumeData, jobDescription);
      if (response.success) {
        setResult(response.data);
      } else {
         toast({
          title: 'Error',
          description: response.error,
          variant: 'destructive',
        });
        setResult(null);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) setResult(null);
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="h-6 w-6 text-primary" />
            AI-Powered ATS Check
          </DialogTitle>
          <DialogDescription>
            Paste a job description to get an AI-driven analysis of your resume's ATS-friendliness.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label htmlFor="job-description-ats">Job Description</Label>
            <Textarea
              id="job-description-ats"
              placeholder="Paste the full job description here for the best analysis..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
            />
          </div>
          
          {isPending && (
             <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg bg-secondary/50">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-muted-foreground">Our AI is analyzing your resume... This may take a moment.</p>
             </div>
          )}

          {result && !isPending && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">ATS Compatibility Score</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                    <p className={`text-6xl font-bold ${result.score > 70 ? 'text-green-500' : result.score > 40 ? 'text-yellow-500' : 'text-red-500'}`}>{result.score}</p>
                    <p className="text-sm text-muted-foreground mt-1">out of 100</p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><CheckCircle className="h-5 w-5 text-green-500" />What You're Doing Well</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.feedback}</p>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><AlertTriangle className="h-5 w-5 text-yellow-500" />Areas for Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.suggestions}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button onClick={handleCheck} disabled={isPending || !jobDescription.trim()} className="w-full sm:w-auto">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Analyze Resume
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
