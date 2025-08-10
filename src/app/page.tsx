import { AtsFriendlyResumeGenerator } from "@/components/ats-friendly-resume-generator";
import { JobTracker } from "@/components/job-tracker";
import { Header } from "@/components/shared/header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AtsFriendlyResumeGenerator />
        <JobTracker />
      </main>
      <footer className="flex items-center justify-center py-6 md:py-8 w-full border-t">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} ResuAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
