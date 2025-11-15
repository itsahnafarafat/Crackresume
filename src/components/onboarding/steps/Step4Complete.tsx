'use client';

import { CheckCircle2 } from 'lucide-react';

export function Step4Complete() {
  return (
    <div className="text-center space-y-4">
       <div className="flex justify-center">
        <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
      </div>
      <h1 className="text-2xl font-bold tracking-tight">You're All Set!</h1>
      <p className="text-muted-foreground max-w-md mx-auto">
        Your profile is complete. You can now use all of Crackresume's features to accelerate your job search. Good luck!
      </p>
    </div>
  );
}
