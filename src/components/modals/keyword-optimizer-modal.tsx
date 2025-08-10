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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';
import { runKeywordOptimizer } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import type { ResumeData } from '@/lib/types';
import { Card, CardContent } from '../ui/card';

interface KeywordOptimizerModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  resumeData: ResumeData;
}

export function KeywordOptimizerModal({ isOpen, onOpenChange, resumeData }: KeywordOptimizerModalProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!jobDescription.trim()) {
      toast({
        title: 'Missing Job Description',
        description: 'Please provide a job description to optimize your resume.',
        variant: 'destructive',
      });
      return;
    }
    
    const resumeText = JSON.stringify(resumeData);

    startTransition(async () => {
      const result = await runKeywordOptimizer(resumeText, jobDescription);
      if (result.success) {
        setSuggestions(result.data);
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Keyword Optimizer
          </DialogTitle>
          <DialogDescription>
            Paste a job description to get keyword suggestions for your resume.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="job-description-optimizer">Job Description</Label>
            <Textarea
              id="job-description-optimizer"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
            />
          </div>
        </div>
        
        {suggestions && (
          <Card className="bg-secondary/50">
            <CardContent className="p-4">
               <h4 className="font-semibold mb-2">Keyword Suggestions:</h4>
               <div className="prose prose-sm max-w-none whitespace-pre-wrap">{suggestions}</div>
            </CardContent>
          </Card>
        )}

        <DialogFooter>
          <Button onClick={handleGenerate} disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Optimize Keywords
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
