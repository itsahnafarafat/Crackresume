'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { AnimatePresence, motion } from 'framer-motion';

import { Step1Welcome } from './steps/Step1Welcome';
import { Step2ResumeUpload } from './steps/Step2ResumeUpload';
import { Step3JobPreferences } from './steps/Step3JobPreferences';
import { Step4Complete } from './steps/Step4Complete';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface OnboardingData {
  resumeContent?: string;
  jobTitles?: string;
  jobLevel?: string;
  jobLocation?: string;
}

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Persist current step to localStorage
    const savedStep = localStorage.getItem('onboardingStep');
    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('onboardingStep', String(currentStep));
  }, [currentStep]);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const handleComplete = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      // Save all collected data to the user's profile in Firestore
      const userProfileRef = doc(firestore, 'users', user.uid);
      await setDoc(userProfileRef, {
        onboardingComplete: true,
        resumeContent: onboardingData.resumeContent || user.resumeContent || '',
        jobPreferences: {
          jobTitles: onboardingData.jobTitles || '',
          jobLevel: onboardingData.jobLevel || '',
          jobLocation: onboardingData.jobLocation || '',
        }
      }, { merge: true });

      localStorage.removeItem('onboardingStep');
      onComplete();

    } catch (error) {
      console.error("Failed to save onboarding data:", error);
    } finally {
        setIsSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Welcome />;
      case 2:
        return <Step2ResumeUpload data={onboardingData} updateData={updateOnboardingData} />;
      case 3:
        return <Step3JobPreferences data={onboardingData} updateData={updateOnboardingData} />;
      case 4:
        return <Step4Complete />;
      default:
        return <Step1Welcome />;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-card border rounded-xl shadow-2xl flex flex-col">
        {/* Progress Bar and Indicator */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg">Welcome to Crackresume!</h2>
            <span className="text-sm text-muted-foreground font-medium">{currentStep}/{totalSteps}</span>
          </div>
           <Progress value={progress} indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500" />
        </div>

        {/* Step Content */}
        <div className="p-6 md:p-8 flex-grow overflow-y-auto">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="p-6 border-t bg-secondary/50 rounded-b-xl flex justify-between items-center">
          <div>
            {currentStep > 1 && currentStep < totalSteps && (
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>
          <div>
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleComplete} disabled={isSaving}>
                {isSaving ? <><Loader2 className="animate-spin" /> Saving...</> : 'Get Started'}
                </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
