
import { AtsFriendlyResumeGenerator } from "@/components/ats-friendly-resume-generator";
import { Header } from "@/components/shared/header";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AtsFriendlyResumeGenerator />
        <div className="py-12 md:py-16 lg:py-20 text-center bg-muted/20">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Track Your Applications</h2>
            <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4 px-4">
                Keep all your job applications organized in one place with our Job Tracker.
            </p>
            <div className="mt-6 flex justify-center gap-4">
                <Link href="/job-tracker">
                    <Button>Go to Job Tracker</Button>
                </Link>
            </div>
        </div>
      </main>
      <footer className="flex flex-col items-center justify-center gap-4 py-6 md:py-8 w-full border-t">
          <div className="flex gap-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:underline">About</Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">Privacy Policy</Link>
          </div>
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} SkillSync. All rights reserved.</p>
      </footer>
    </div>
  );
}
