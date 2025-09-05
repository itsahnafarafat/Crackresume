
'use client';

import Link from "next/link";
import { LogOut, User as UserIcon, Menu, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "../ui/sheet";
import { Separator } from "../ui/separator";

export function Header() {
  const { user, logout } = useAuth();
  
  const navLinks = (
    <>
        <Link
            href="/"
            className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
        >
            Resume Tool
        </Link>
        <Link
            href="/job-match"
            className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
        >
            Job Match
        </Link>
        <Link
            href="/learning-hub"
            className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
        >
            Learning Hub
        </Link>
        <Link
            href="/about"
            className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
        >
            About
        </Link>
        <Link
            href="/privacy"
            className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
        >
            Privacy Policy
        </Link>
    </>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl" style={{color: 'hsl(var(--foreground))'}}>Crackresume</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-auto">
          {navLinks}
        </nav>
        <div className="flex items-center gap-2 ml-auto md:ml-6">
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
                 <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/login">Login</Link>
                </Button>
                 <Button asChild size="sm">
                    <Link href="/signup">Sign Up</Link>
                </Button>
            </div>
          )}
           <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="mt-8 flex flex-col gap-6 text-lg font-medium">
                  <SheetClose asChild>
                    <Link href="/" className="flex items-center space-x-2">
                      <span className="font-bold text-xl">Crackresume</span>
                    </Link>
                  </SheetClose>
                  <Separator />
                  <nav className="grid gap-6">
                    <SheetClose asChild>{navLinks}</SheetClose>
                  </nav>
                   {!user && (
                    <>
                       <Separator />
                        <div className="flex flex-col gap-4">
                           <SheetClose asChild>
                             <Button asChild variant="ghost">
                                <Link href="/login">Login</Link>
                            </Button>
                           </SheetClose>
                           <SheetClose asChild>
                             <Button asChild>
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                           </SheetClose>
                        </div>
                    </>
                    )}
                </div>
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
