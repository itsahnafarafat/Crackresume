
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
  
  const navLinks = (closeSheet?: () => void) => (
    <>
        <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
            onClick={closeSheet}
        >
            Resume Tool
        </Link>
        <Link
            href="/job-match"
            className="text-muted-foreground transition-colors hover:text-foreground"
            onClick={closeSheet}
        >
            Job Match
        </Link>
        <Link
            href="/learning-hub"
            className="text-muted-foreground transition-colors hover:text-foreground"
            onClick={closeSheet}
        >
            Learning Hub
        </Link>
        <Link
            href="/about"
            className="text-muted-foreground transition-colors hover:text-foreground"
            onClick={closeSheet}
        >
            About
        </Link>
        <Link
            href="/privacy"
            className="text-muted-foreground transition-colors hover:text-foreground"
            onClick={closeSheet}
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
          {navLinks()}
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
                <SheetClose asChild>
                    <Link href="/" className="flex items-center space-x-2">
                      <span className="font-bold text-xl">Crackresume</span>
                    </Link>
                </SheetClose>
                <Separator className="my-4" />
                <nav className="grid gap-4 text-base font-medium">
                  {navLinks(() => {
                    const closeButton = document.querySelector('[data-radix-dialog-close]');
                    if (closeButton instanceof HTMLElement) {
                      closeButton.click();
                    }
                  })}
                </nav>
                <Separator className="my-4" />
                {!user && (
                    <div className="grid gap-4">
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
                )}
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
