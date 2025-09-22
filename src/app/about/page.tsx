import { Header } from "@/components/shared/header";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col main-bg">
      <Header />
      <main className="flex-1 relative z-10 pt-28">
        <div className="container mx-auto py-12 px-4 md:px-6 animate-in fade-in-50 slide-in-from-top-8 duration-1000">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">About Crackresume</h1>
            <p className="mt-6 text-xl text-muted-foreground">
              Crackresume is an innovative platform designed to bridge the gap between job seekers and their dream careers. In today's competitive job market, a standout resume is crucial. That's where we come in.
            </p>
            <div className="mt-10 prose prose-lg text-left mx-auto">
              <p>
                Our mission is to empower individuals with the tools they need to create perfectly tailored, ATS-friendly resumes that capture the attention of recruiters. We leverage the power of artificial intelligence to analyze job descriptions and help you highlight the most relevant skills and experiences from your professional history.
              </p>
              <p>
                Beyond resume building, Crackresume also provides a comprehensive job tracker, allowing you to manage your applications, monitor your progress, and stay organized throughout your job search. We believe that with the right tools, anyone can unlock their full potential and land the job they deserve.
              </p>
              <p>
                Whether you're a recent graduate or a seasoned professional, Crackresume is your partner in navigating the complexities of the modern job search.
              </p>
            </div>
          </div>
        </div>
      </main>
       <footer className="flex items-center justify-center py-6 md:py-8 w-full border-t border-white/5 relative z-10">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Crackresume. All rights reserved.</p>
      </footer>
    </div>
  );
}
