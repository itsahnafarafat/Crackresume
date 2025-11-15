'use client';

import { Textarea } from '@/components/ui/textarea';
import { UploadCloud } from 'lucide-react';
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface Step2Props {
  data: { resumeContent?: string };
  updateData: (data: { resumeContent: string }) => void;
}

export function Step2ResumeUpload({ data, updateData }: Step2Props) {
  const { user } = useAuth();
  
  // Pre-fill with user's saved resume if it exists and hasn't been set yet
  useEffect(() => {
    if (user?.resumeContent && !data.resumeContent) {
      updateData({ resumeContent: user.resumeContent });
    }
  }, [user, data.resumeContent, updateData]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex justify-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-primary" />
            </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Add Your Resume</h1>
        <p className="text-muted-foreground">
          Paste your most recent resume below. This will be your base for all AI-powered tools.
        </p>
      </div>
      <Textarea
        placeholder="Paste your full resume content here..."
        className="min-h-[250px] text-sm bg-background"
        value={data.resumeContent || ''}
        onChange={(e) => updateData({ resumeContent: e.target.value })}
      />
    </div>
  );
}
