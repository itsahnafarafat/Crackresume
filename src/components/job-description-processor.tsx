
'use client';

import React, { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractJobDetails } from '@/ai/flows/extract-job-details';
import type { Job } from '@/lib/types';

export function JobDescriptionProcessor() {
  const [jobDescription, setJobDescription] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleTrackJob = () => {
    if (!jobDescription.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please paste a job description.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      try {
        const jobDetails = await extractJobDetails({ jobDescription });
        
        if (jobDetails.companyName && jobDetails.jobTitle) {
          const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
          const newJob: Job = {
            id: new Date().toISOString(),
            ...jobDetails,
            status: 'Saved',
            applicationDate: new Date().toISOString(),
            notes: '',
            jobDescription: jobDescription,
          };
          
          storedJobs.unshift(newJob);
          localStorage.setItem('jobs', JSON.stringify(storedJobs));
          
          // Dispatch a storage event to notify other components (like JobTracker)
          window.dispatchEvent(new Event('storage'));
          
          toast({
            title: 'Job Tracked!',
            description: `${jobDetails.jobTitle} at ${jobDetails.companyName} has been added to your list.`,
          });
          setJobDescription(''); // Clear textarea after success
        } else {
             toast({
                title: 'Could Not Extract Details',
                description: 'The AI could not identify a job title and company. Please try a different job description.',
                variant: 'destructive',
            });
        }

      } catch (error) {
        console.error('Track Job Error:', error);
        toast({
          title: 'Error',
          description: 'Failed to process the request. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <Textarea
          id="job-description"
          placeholder="Paste the full job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={10}
          className="text-sm"
        />
        <div className="flex justify-center">
          <Button onClick={handleTrackJob} disabled={isPending} size="lg">
            {isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-5 w-5" />
            )}
            Track Job
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
