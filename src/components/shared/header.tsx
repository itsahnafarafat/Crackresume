
'use client';

import Link from "next/link";
import { Info, LogOut, ShieldCheck, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export function Header() {
  const { user, logout } = useAuth();

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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-8 w-8">
                  <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                  <AvatarFallback>
                    {user.email ? user.email.charAt(0).toUpperCase() : <UserIcon />}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/login">Login</Link>
                </Button>
                 <Button asChild size="sm">
                    <Link href="/signup">Sign Up</Link>
                </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
