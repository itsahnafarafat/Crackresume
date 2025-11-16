'use client';

import { ResumeManager } from "@/components/dashboard/resume-manager";
import { JobTracker } from "@/components/job-tracker";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { Header } from "@/components/shared/header";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const { user, loading, refreshUser } = useAuth();
    const router = useRouter();
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        if (!loading && user && !user.onboardingComplete) {
            setShowOnboarding(true);
        }
    }, [user, loading, router]);
    
    const handleOnboardingComplete = async () => {
        await refreshUser(); // Explicitly refresh user data
        setShowOnboarding(false);
    }

    if (loading || !user) {
        return (
            <div className="flex h-screen items-center justify-center main-bg">
                <Loader2 className="h-12 w-12 animate-spin" />
            </div>
        );
    }
    
    if (showOnboarding) {
        return <OnboardingFlow onComplete={handleOnboardingComplete} />;
    }
    
    return (
        <div className="flex min-h-screen flex-col main-bg">
            <Header />
            <main className="flex-1 relative z-10 pt-28">
                <div className="w-full py-12 md:py-16 lg:py-20 animate-in fade-in-50 slide-in-from-top-8 duration-1000">
                    <div className="container px-4">
                         <div className="flex flex-col items-start justify-center space-y-2 mb-8">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                                Welcome back, {user.displayName || 'User'}!
                            </h1>
                            <p className="text-muted-foreground md:text-xl">
                                Manage your resume and job applications here.
                            </p>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-3">
                            <div className="lg:col-span-1">
                                <ResumeManager />
                            </div>
                            <div className="lg:col-span-2">
                                <JobTracker />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
             <footer className="flex flex-col items-center justify-center gap-4 py-6 md:py-8 w-full border-t border-white/5 mt-auto relative z-10">
                <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Crackresume. All rights reserved.</p>
            </footer>
        </div>
    )
}
