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
import { ScanLine, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { runAtsCheck } from '@/lib/actions';
import type { ResumeData } from '@/lib/types';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

interface AtsCheckModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  resumeData: ResumeData;
}

interface AtsResult {
  issues: string[];
  goodPoints: string[];
}

export function AtsCheckModal({ isOpen, onOpenChange, resumeData }: AtsCheckModalProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<AtsResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCheck = () => {
    startTransition(() => {
      const checkResult = runAtsCheck(resumeData, jobDescription);
      setResult(checkResult);
    });
  };
  
  const score = result ? Math.max(0, 100 - result.issues.length * 20) : null;


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="h-6 w-6 text-primary" />
            ATS Compatibility Check
          </DialogTitle>
          <DialogDescription>
            Get feedback on how well your resume might perform with Applicant Tracking Systems. For best results, provide a job description.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
           <div className="space-y-2">
              <Label htmlFor="job-description-ats">Job Description (Optional)</Label>
              <Textarea
                id="job-description-ats"
                placeholder="Paste a job description for a more accurate keyword analysis..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={5}
              />
            </div>
          
          {result && score !== null && (
            <div>
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">ATS Compatibility Score</p>
                <p className={`text-5xl font-bold ${score > 70 ? 'text-green-500' : score > 40 ? 'text-yellow-500' : 'text-red-500'}`}>{score}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" />What you're doing well:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {result.goodPoints.map((point, i) => <li key={i}>{point}</li>)}
                  </ul>
                </div>
                 <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-yellow-500" />Areas for improvement:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                     {result.issues.length > 0 ? result.issues.map((issue, i) => <li key={i}>{issue}</li>) : <li>No major issues found!</li>}
                  </ul>
                </div>
              </div>

            </div>
          )}

        </div>

        <DialogFooter>
          <Button onClick={handleCheck} disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanLine className="mr-2 h-4 w-4" />}
            Run ATS Check
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
