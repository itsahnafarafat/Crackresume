import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/shared/header";
import { Sparkles, ScanLine, FileText, Bot, ArrowRight } from "lucide-react";

const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: "AI Content Assist",
    description: "Get AI-guided content suggestions for your experience, skills, and summary sections, tailored to your target job.",
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: "Keyword Optimizer",
    description: "Analyze job descriptions and get real-time feedback on keywords to improve your resume's relevance.",
  },
  {
    icon: <ScanLine className="h-8 w-8 text-primary" />,
    title: "ATS Compatibility Check",
    description: "Ensure your resume is compatible with Applicant Tracking Systems and get actionable feedback to fix any issues.",
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Customizable Templates",
    description: "Choose from a library of professional, modern templates that are easy to customize and ATS-friendly.",
  },
];


export function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Build Your Job-Winning Resume with AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    ResuAI helps you create a professional, tailored resume in minutes. Leverage AI to write compelling content, optimize for keywords, and pass ATS scans with ease.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="group">
                    <Link href="/editor">
                      Start Building for Free
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
              <img
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="resume professional"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">The Ultimate Toolkit for Your Career</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to craft a resume that stands out to recruiters and hiring managers.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 mt-12">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center h-full">
                  <CardHeader className="items-center">
                    {feature.icon}
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

      </main>
      <footer className="flex items-center justify-center py-6 md:py-8 w-full border-t">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} ResuAI. All rights reserved.</p>
      </footer>
    </div>
  )
}
