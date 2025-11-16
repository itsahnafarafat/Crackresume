
'use client';

import { useState, useCallback } from 'react';
import { useAuth } from './use-auth';
import { doc, updateDoc, increment, serverTimestamp, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { PaywallDialog } from '@/components/shared/paywall-dialog';

export type AiFeature = 'resume' | 'coverLetter' | 'jobMatch';

const FREE_TIER_LIMIT = 5;

export function useUsage() {
    const { user, refreshUser } = useAuth();
    const [isPaywallOpen, setPaywallOpen] = useState(false);

    const checkUsage = useCallback(async (feature: AiFeature) => {
        if (!user) return { hasUsage: false }; // Should not happen if called correctly
        if (user.isPro) return { hasUsage: true };

        // Ensure usage data is fresh, especially around month changes
        await refreshUser();
        
        const now = Timestamp.now();
        const lastReset = user.usage?.lastReset || new Timestamp(0, 0);
        const oneMonthAgo = now.seconds - 30 * 24 * 60 * 60;
        
        // Check if we need to reset the usage
        if (lastReset.seconds < oneMonthAgo) {
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

        const currentUsage = (user.usage?.resumeGenerations || 0) + 
                             (user.usage?.coverLetterGenerations || 0) +
                             (user.usage?.jobMatchAnalyses || 0);
        
        if (currentUsage >= FREE_TIER_LIMIT) {
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
    
    return {
        checkUsage,
        incrementUsage,
        Paywall: () => <PaywallDialog isOpen={isPaywallOpen} onOpenChange={setPaywallOpen} />
    };
}
