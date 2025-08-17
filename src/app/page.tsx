'use client';

import { AtsResumeGenerator } from "@/components/ats-resume-generator";
import { JobTracker } from "@/components/job-tracker";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/40">
        <Header />
        <main className="flex-1 flex items-center justify-center">
         <div className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                  Welcome to SkillSync
                </h1>
                <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                  Log in to generate ATS-friendly resumes and track your job applications seamlessly.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                  <Button asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </main>
         <footer className="flex flex-col items-center justify-center gap-4 py-6 md:py-8 w-full border-t mt-auto">
          <div className="flex gap-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:underline">About</Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">Privacy Policy</Link>
          </div>
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} SkillSync. All rights reserved.</p>
        </footer>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-1">
         <div className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                  ATS-Friendly Resume Generator
                </h1>
                <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                  Paste your resume and a job description. The AI will rewrite your resume and automatically track the job for you.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-7xl mt-12">
              <AtsResumeGenerator />
            </div>
          </div>
        </div>
        <JobTracker />
      </main>
      <footer className="flex flex-col items-center justify-center gap-4 py-6 md:py-8 w-full border-t mt-auto">
          <div className="flex gap-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:underline">About</Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">Privacy Policy</Link>
          </div>
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} SkillSync. All rights reserved.</p>
      </footer>
    </div>
  );
}
