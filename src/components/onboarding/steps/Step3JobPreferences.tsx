'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target } from 'lucide-react';

interface Step3Props {
  data: {
    jobTitles?: string;
    jobLevel?: string;
    jobLocation?: string;
  };
  updateData: (data: {
    jobTitles?: string;
    jobLevel?: string;
    jobLocation?: string;
  }) => void;
}

export function Step3JobPreferences({ data, updateData }: Step3Props) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Target className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">What's Your Target?</h1>
        <p className="text-muted-foreground">
          Tell us what you're looking for. This helps us tailor suggestions for you.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="job-titles">Target Job Titles</Label>
          <Input
            id="job-titles"
            placeholder="e.g., Senior Software Engineer, Product Manager"
            value={data.jobTitles || ''}
            onChange={(e) => updateData({ jobTitles: e.target.value })}
            className="bg-background"
          />
           <p className="text-xs text-muted-foreground mt-1">Separate multiple titles with commas.</p>
        </div>
        <div>
          <Label htmlFor="job-level">Experience Level</Label>
          <Select
            value={data.jobLevel}
            onValueChange={(value) => updateData({ jobLevel: value })}
          >
            <SelectTrigger id="job-level" className="bg-background">
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry">Entry-Level / Intern</SelectItem>
              <SelectItem value="junior">Junior (1-3 years)</SelectItem>
              <SelectItem value="mid">Mid-Level (3-5 years)</SelectItem>
              <SelectItem value="senior">Senior (5-10 years)</SelectItem>
              <SelectItem value="lead">Lead / Principal (10+ years)</SelectItem>
              <SelectItem value="manager">Manager / Director</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="job-location">Preferred Location(s)</Label>
          <Input
            id="job-location"
            placeholder="e.g., San Francisco, CA, Remote"
            value={data.jobLocation || ''}
            onChange={(e) => updateData({ jobLocation: e.target.value })}
            className="bg-background"
          />
        </div>
      </div>
    </div>
  );
}
