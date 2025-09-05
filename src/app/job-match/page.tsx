
import { JobMatchAnalyzer } from "@/components/job-match-analyzer";
import { Header } from "@/components/shared/header";
import Link from "next/link";

export default function JobMatchPage() {

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <Header />
      <main className="flex-1">
        <div className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none">
                  Job Match Analyzer
                </h1>
                <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                  Paste your resume and a job description to see how well you match the position.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-7xl mt-12">
              <JobMatchAnalyzer />
            </div>
          </div>
        </div>
      </main>

      <footer className="flex flex-col items-center justify-center gap-4 py-6 md:py-8 w-full border-t mt-auto">
        <div className="flex gap-4">
          <Link href="/about" className="text-sm text-muted-foreground hover:underline">About</Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">Privacy Policy</Link>
        </div>
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Crackresume. All rights reserved.</p>
      </footer>
    </div>
  );
}
