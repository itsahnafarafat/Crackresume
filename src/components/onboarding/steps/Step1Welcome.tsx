'use client';

import { PartyPopper } from 'lucide-react';

export function Step1Welcome() {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
          <PartyPopper className="w-8 h-8 text-primary" />
        </div>
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Welcome to Your Career Cockpit!</h1>
      <p className="text-muted-foreground max-w-md mx-auto">
        You're just a few steps away from supercharging your job search. Let's get your profile set up so you can start landing interviews.
      </p>
    </div>
  );
}
