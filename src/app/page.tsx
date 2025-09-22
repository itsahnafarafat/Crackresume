
'use client';

import { AtsResumeGenerator } from "@/components/ats-resume-generator";
import { Header } from "@/components/shared/header";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { JobTracker } from "@/components/job-tracker";
import { analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, "page_view", { page: "home" });
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center main-bg">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col main-bg">
      <Header />
      <main className="flex-1 relative z-10">
        <div className="w-full py-20 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16 animate-in fade-in-25 slide-in-from-top-8 duration-1000 ease-in-out">
              <div className="space-y-6">
                 <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-semibold text-primary">AI-POWERED JOB APPLICATION TOOLKIT</div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-br from-gray-50 to-gray-400">
                  Land Your Dream Job Faster
                </h1>
                <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
                  Generate ATS-friendly resumes, analyze job matches, and craft perfect cover letters with the power of AI. Your next interview is just a click away.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-7xl mt-12 animate-in fade-in-50 delay-500 duration-1000">
              <AtsResumeGenerator />
            </div>

             <div className="mx-auto max-w-7xl mt-24">
               <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Your All-in-One Job Search Command Center</h2>
                  <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">Stay organized and focused. Track every application from "Saved" to "Offer".</p>
               </div>
              <JobTracker
                limit={5}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="flex flex-col items-center justify-center gap-4 py-6 md:py-8 w-full border-t border-white/5 mt-auto relative z-10">
        <div className="flex gap-4">
          <Link href="/about" className="text-sm text-muted-foreground hover:underline">About</Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">Privacy Policy</Link>
        </div>
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Crackresume. All rights reserved.</p>
      </footer>
    </div>
  );
}
