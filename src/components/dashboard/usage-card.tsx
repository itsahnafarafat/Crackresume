
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { FREE_TIER_LIMIT } from "@/hooks/use-usage.tsx";
import { CheckCircle, InfinityIcon, Zap } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export function UsageCard() {
    const { user } = useAuth();

    const proCheckoutUrl = useMemo(() => {
        if (user) {
            return `${process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_URL}?checkout[custom][user_id]=${user.uid}&checkout[email]=${user.email}`;
        }
        return process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_URL || '/';
    }, [user]);

    const totalUsage = useMemo(() => {
        if (!user?.usage) return 0;
        return (user.usage.resumeGenerations || 0) +
               (user.usage.coverLetterGenerations || 0) +
               (user.usage.jobMatchAnalyses || 0);
    }, [user?.usage]);

    const usagePercentage = useMemo(() => {
        return (totalUsage / FREE_TIER_LIMIT) * 100;
    }, [totalUsage]);
    
    const getScoreColor = (score: number) => {
        if (score > 90) return 'bg-red-500';
        if (score > 60) return 'bg-yellow-500';
        return 'bg-green-500';
    }

    const renderContent = () => {
        if (user?.isPro) {
            return (
                <div className="flex items-center gap-4">
                    <InfinityIcon className="w-10 h-10 text-primary" />
                    <div>
                        <p className="text-2xl font-bold">Unlimited</p>
                        <p className="text-sm text-muted-foreground">You have full access to all AI features.</p>
                    </div>
                </div>
            )
        }

        return (
            <div className="space-y-2">
                <div className="flex justify-between items-center font-semibold">
                    <span>{totalUsage} / {FREE_TIER_LIMIT} used</span>
                     <Link href={proCheckoutUrl} className="text-xs text-primary hover:underline">Upgrade to Pro</Link>
                </div>
                <Progress value={usagePercentage} indicatorClassName={getScoreColor(usagePercentage)} />
                <p className="text-xs text-muted-foreground">Your usage resets monthly.</p>
            </div>
        )
    }

    return (
         <Card className="bg-card/80 backdrop-blur-sm border-white/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Zap />AI Generations</CardTitle>
                <CardDescription>Your monthly usage of AI-powered features.</CardDescription>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
    )
}
