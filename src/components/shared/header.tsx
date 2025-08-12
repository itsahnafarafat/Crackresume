
import Link from "next/link";
import { Button } from "../ui/button";
import { Briefcase, Info, ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl" style={{color: 'hsl(var(--foreground))'}}>SkillSync</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium ml-auto">
          <Link
              href="/job-tracker"
              className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Job Tracker
          </Link>
           <Link
            href="/about"
            className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
          >
             <Info className="mr-2 h-4 w-4" />
            About
          </Link>
          <Link
            href="/privacy"
            className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Privacy Policy
          </Link>
        </nav>
      </div>
    </header>
  );
}
