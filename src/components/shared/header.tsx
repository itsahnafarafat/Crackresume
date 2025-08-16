
'use client';

import Link from "next/link";
import { Button } from "../ui/button";
import { Info, ShieldCheck, User, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


export function Header() {
    const { isLoggedIn, username } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/');
    };

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
            href="/about"
            className="hidden sm:flex items-center text-muted-foreground transition-colors hover:text-foreground"
          >
             <Info className="mr-2 h-4 w-4" />
            About
          </Link>
          <Link
            href="/privacy"
            className="hidden sm:flex items-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Privacy Policy
          </Link>
            {isLoggedIn ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>{username ? username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{username}</p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <>
                <Link href="/login">
                    <Button variant="outline" size="sm">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                    </Button>
                </Link>
                <Link href="/signup">
                    <Button size="sm">
                        Sign Up
                    </Button>
                </Link>
                </>
            )}
        </nav>
      </div>
    </header>
  );
}
