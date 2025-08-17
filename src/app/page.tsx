
'use client';

import { AtsResumeGenerator } from "@/components/ats-resume-generator";
import { JobTracker } from "@/components/job-tracker";
import { Header } from "@/components/shared/header";
import Link from "next/link";

export default function Home() {
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
                  Paste your resume and a job description. The AI will rewrite your resume to help you land your next interview.
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
