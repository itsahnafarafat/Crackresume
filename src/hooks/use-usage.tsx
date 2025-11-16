
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './use-auth';
import { doc, updateDoc, increment, serverTimestamp, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { PaywallDialog } from '@/components/shared/paywall-dialog';

export type AiFeature = 'resume' | 'coverLetter' | 'jobMatch';

export const FREE_TIER_LIMIT = 10;

export function useUsage() {
    const { user, refreshUser } = useAuth();
    const [isPaywallOpen, setPaywallOpen] = useState(false);

    const checkUsage = useCallback(async (feature: AiFeature) => {
        if (!user) return { hasUsage: true }; // Allow generation for non-logged-in users
        if (user.isPro) return { hasUsage: true };

        const now = Timestamp.now();
        const lastReset = user.usage?.lastReset || new Timestamp(0, 0);
        
        const oneMonthInSeconds = 30 * 24 * 60 * 60;
        
        // If lastReset is older than one month, reset the counts
        if (now.seconds - lastReset.seconds > oneMonthInSeconds) {
            const userDocRef = doc(firestore, 'users', user.uid);
            await updateDoc(userDocRef, {
                'usage.resumeGenerations': 0,
                'usage.coverLetterGenerations': 0,
                'usage.jobMatchAnalyses': 0,
                'usage.lastReset': serverTimestamp()
            });
            await refreshUser(); // re-fetch user to get the reset counts
            return { hasUsage: true }; // Allow first use after reset
        }

        const currentTotalUsage = (user.usage?.resumeGenerations || 0) + 
                                  (user.usage?.coverLetterGenerations || 0) +
                                  (user.usage?.jobMatchAnalyses || 0);
        
        if (currentTotalUsage >= FREE_TIER_LIMIT) {
            setPaywallOpen(true);
            return { hasUsage: false };
        }

        return { hasUsage: true };

    }, [user, refreshUser]);

    const incrementUsage = useCallback(async (feature: AiFeature) => {
        if (!user || user.isPro) return;

        const userDocRef = doc(firestore, 'users', user.uid);
        let fieldToIncrement = '';
        if (feature === 'resume') fieldToIncrement = 'usage.resumeGenerations';
        if (feature === 'coverLetter') fieldToIncrement = 'usage.coverLetterGenerations';
        if (feature === 'jobMatch') fieldToIncrement = 'usage.jobMatchAnalyses';

        if (fieldToIncrement) {
             await updateDoc(userDocRef, {
                [fieldToIncrement]: increment(1)
            });
            await refreshUser();
        }
    }, [user, refreshUser]);
    
    // Periodically refresh user data to ensure usage is up-to-date,
    // especially for the monthly reset.
    useEffect(() => {
        if (user && !user.isPro) {
            const interval = setInterval(() => {
                refreshUser();
            }, 5 * 60 * 1000); // every 5 minutes
            return () => clearInterval(interval);
        }
    }, [user, refreshUser]);
    
    return {
        checkUsage,
        incrementUsage,
        Paywall: () => <PaywallDialog isOpen={isPaywallOpen} onOpenChange={setPaywallOpen} />
    };
}

    