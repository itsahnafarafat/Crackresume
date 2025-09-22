
'use client';

import { AtsResumeGenerator } from "@/components/ats-resume-generator";
import { Header } from "@/components/shared/header";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, FileText, ClipboardCheck, Check, UploadCloud, Bot, Target } from "lucide-react";
import { JobTracker } from "@/components/job-tracker";
import { analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobMatchAnalyzer } from "@/components/job-match-analyzer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const pricingTiers = [
    {
        name: "Free",
        price: "$0",
        period: "/ month",
        description: "For individuals just getting started.",
        features: [
            "10 Resume Generations / month",
            "10 Job Match Analyses / month",
            "Basic Job Tracker",
            "Access to Learning Hub",
        ],
        cta: "Get Started for Free",
        href: "/signup",
        isFeatured: false,
    },
    {
        name: "Pro",
        price: "$19",
        period: "/ month",
        description: "For serious job seekers who need an edge.",
        features: [
            "Unlimited Resume Generations",
            "Unlimited Job Match Analyses",
            "Unlimited Cover Letter Generations",
            "Advanced Job Tracker",
            "Priority Support",
            "Early access to new features"
        ],
        cta: "Go Pro",
        href: "#", // Replace with your payment link
        isFeatured: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "For career coaches and organizations.",
        features: [
            "Everything in Pro",
            "Multi-user management",
            "Custom branding",
            "Dedicated Account Manager",
            "API Access",
        ],
        cta: "Contact Sales",
        href: "#", // Replace with your contact link
        isFeatured: false,
    }
];

const howItWorksSteps = [
    {
        icon: <UploadCloud className="w-10 h-10 text-primary" />,
        title: "Step 1: Provide Your Details",
        description: "Paste your current resume and the description of the job you're targeting. This gives our AI the context it needs."
    },
    {
        icon: <Bot className="w-10 h-10 text-primary" />,
        title: "Step 2: Get AI-Powered Insights",
        description: "Generate an ATS-optimized resume in seconds. Analyze your job match score to understand your strengths and weaknesses."
    },
    {
        icon: <Target className="w-10 h-10 text-primary" />,
        title: "Step 3: Apply with Confidence",
        description: "Use your newly tailored resume and cover letter to apply. Track all your applications from 'Saved' to 'Offer' in one place."
    }
];

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
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16 animate-in fade-in-25 slide-in-from-top-8 duration-1000 ease-in-out">
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

            <div className="mx-auto max-w-7xl mt-20">
                <div className="text-center mb-12 animate-in fade-in-50 delay-500 duration-1000">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How It Works</h2>
                  <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">Transform your job search in three simple steps.</p>
               </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in-50 delay-700 duration-1000">
                    {howItWorksSteps.map((step, index) => (
                         <div key={index} className="flex flex-col items-center text-center p-6 bg-card/50 rounded-xl border border-white/10">
                            <div className="mb-4 bg-secondary p-4 rounded-full">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mx-auto max-w-7xl mt-20 animate-in fade-in-50 delay-700 duration-1000">
                <Tabs defaultValue="resume-tool" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto h-12">
                        <TabsTrigger value="resume-tool" className="h-10 text-base">
                            <FileText className="mr-2" /> ATS Resume Tool
                        </TabsTrigger>
                        <TabsTrigger value="job-match" className="h-10 text-base">
                            <ClipboardCheck className="mr-2"/> Job Match Analyzer
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="resume-tool" className="mt-8">
                        <AtsResumeGenerator />
                    </TabsContent>
                    <TabsContent value="job-match" className="mt-8">
                        <JobMatchAnalyzer />
                    </TabsContent>
                </Tabs>
            </div>

             <div className="mx-auto max-w-7xl mt-24">
               <div className="text-center mb-12 animate-in fade-in-50 delay-[900ms] duration-1000">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Your All-in-One Job Search Command Center</h2>
                  <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mt-4">Stay organized and focused. Track every application from "Saved" to "Offer".</p>
               </div>
              <div className="animate-in fade-in-50 delay-[1100ms] duration-1000">
                <JobTracker
                    limit={5}
                />
              </div>
            </div>

            <div id="pricing" className="mx-auto w-full max-w-5xl mt-24">
               <div className="max-w-3xl mx-auto text-center animate-in fade-in-50 delay-[1300ms] duration-1000">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Simple, transparent pricing</h2>
                    <p className="mt-4 text-xl text-muted-foreground">
                        Choose the plan that's right for you. Unlock your career potential today.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {pricingTiers.map((tier, index) => (
                        <Card key={tier.name} className={`flex flex-col bg-card/80 backdrop-blur-sm border-white/10 ${tier.isFeatured ? 'border-primary/50 shadow-2xl shadow-primary/10' : ''} animate-in fade-in-50 slide-in-from-bottom-12 duration-1000`} style={{animationDelay: `${1500 + index * 200}ms`}}>
                            <CardHeader className="p-6">
                                <h3 className="text-lg font-semibold text-primary">{tier.name}</h3>
                                <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">{tier.price}<span className="text-lg font-normal text-muted-foreground">{tier.period}</span></p>
                                <CardDescription className="mt-3">{tier.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 p-6 pt-0">
                                <ul className="space-y-4 text-sm text-muted-foreground">
                                    {tier.features.map(feature => (
                                        <li key={feature} className="flex items-center">
                                            <Check className="h-4 w-4 mr-2 text-primary" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="p-6">
                                <Button asChild className="w-full" variant={tier.isFeatured ? 'default' : 'outline'}>
                                    <Link href={tier.href}>{tier.cta}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
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
