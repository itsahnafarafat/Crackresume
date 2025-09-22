
'use client';

import { JobMatchAnalyzer } from "@/components/job-match-analyzer";
import { Header } from "@/components/shared/header";
import { useAuth } from "@/hooks/use-auth";
import { ClipboardCheck, Loader2, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function JobMatchPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin" />
                </div>
            );
        }

        if (!user) {
            return (
                <Card className="mt-12 bg-card/80 backdrop-blur-sm border-white/10">
                    <CardContent className="text-center py-12 text-muted-foreground">
                        <ClipboardCheck className="mx-auto h-12 w-12" />
                        <h3 className="mt-4 text-lg font-semibold text-foreground">Unlock the Job Match Analyzer</h3>
                        <p className="mt-1 text-sm">Log in or create an account to analyze your job match and save your results.</p>
                        <div className="flex gap-4 justify-center pt-4">
                            <Button asChild>
                                <Link href="/login"><LogIn /> Login</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/signup"><UserPlus /> Sign Up</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        return <JobMatchAnalyzer />;
    }

  return (
    <div className="flex min-h-screen flex-col main-bg">
      <Header />
      <main className="flex-1 relative z-10">
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
              {renderContent()}
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
