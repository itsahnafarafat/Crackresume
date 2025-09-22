
'use client';

import Link from "next/link";
import { LogOut, User as UserIcon, Menu, LayoutDashboard, Wand2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "../ui/sheet";
import { Separator } from "../ui/separator";

const Logo = () => (
    <Link href="/" className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Wand2 className="text-primary w-5 h-5" />
        </div>
        <span className="font-bold text-xl text-foreground">Crackresume</span>
    </Link>
)

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
    <header className="sticky top-4 z-50 w-full">
        <div className="container flex h-14 items-center rounded-xl border bg-background/60 p-4 backdrop-blur-sm">
            <div className="mr-4 hidden md:flex">
                <Logo />
            </div>
            <nav className="hidden md:flex items-center gap-2 text-sm font-medium mx-auto">
                {navLinks()}
            </nav>
            <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
                <div className="w-full flex-1 md:w-auto md:flex-none">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetClose asChild>
                                <Logo />
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
                                    <Button asChild variant="ghost" className="w-full">
                                        <Link href="/login">Login</Link>
                                    </Button>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Button asChild className="w-full">
                                        <Link href="/signup">Sign Up</Link>
                                    </Button>
                                </SheetClose>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                    <div className="md:hidden">
                        <Logo />
                    </div>
                </div>

                <div className="flex items-center gap-2">
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
                </div>
            </div>
        </div>
    </header>
  );
}
