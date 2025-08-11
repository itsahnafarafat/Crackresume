
import Link from "next/link";
import { Button } from "../ui/button";
import { Briefcase, Info, ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
             <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
              >
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="hsl(var(--primary))"/>
                  <stop offset="1" stopColor="hsl(var(--accent))"/>
                </linearGradient>
              </defs>
               <path d="M4 8C4 5.79086 5.79086 4 8 4H24C26.2091 4 28 5.79086 28 8V24C28 26.2091 26.2091 28 24 28H8C5.79086 28 4 26.2091 4 24V8Z" fill="url(#logo-gradient)"/>
               <path d="M22.0882 10.9668L14.4215 18.6335C14.1208 18.9341 13.6375 18.9341 13.3368 18.6335L10.4215 15.7181C10.1208 15.4175 10.1208 14.9341 10.4215 14.6335C10.7221 14.3328 11.2055 14.3328 11.5061 14.6335L13.8791 17.0065L21.0035 9.88214C21.3041 9.58151 21.7875 9.58151 22.0882 9.88214C22.3888 10.1828 22.3888 10.6662 22.0882 10.9668Z" fill="white"/>
            </svg>
            <span className="font-bold text-xl" style={{color: 'hsl(var(--foreground))'}}>SkillSync</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium ml-auto">
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
