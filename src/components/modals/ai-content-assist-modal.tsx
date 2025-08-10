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
import { Bot, Loader2 } from 'lucide-react';
import { runAiContentAssist } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '../ui/card';

interface AiContentAssistModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AiContentAssistModal({ isOpen, onOpenChange }: AiContentAssistModalProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeContent, setResumeContent] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!jobDescription.trim() || !resumeContent.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both a job description and some resume content to get suggestions.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      const result = await runAiContentAssist(jobDescription, resumeContent);
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            AI Content Assist
          </DialogTitle>
          <DialogDescription>
            Paste a job description and your current resume section content. The AI will provide suggestions to improve it.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume-content">Your Resume Content</Label>
            <Textarea
              id="resume-content"
              placeholder="Paste the relevant part of your resume (e.g., a bullet point from your experience section)..."
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
              rows={8}
            />
          </div>
        </div>

        {suggestions && (
          <Card className="bg-secondary/50">
            <CardContent className="p-4">
               <h4 className="font-semibold mb-2">Suggestions:</h4>
               <div className="prose prose-sm max-w-none whitespace-pre-wrap">{suggestions}</div>
            </CardContent>
          </Card>
        )}

        <DialogFooter>
          <Button onClick={handleGenerate} disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
            Generate Suggestions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
