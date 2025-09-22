
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
  
  const navLinks = (isSheet = false) => {
    const commonClasses = "text-muted-foreground transition-colors hover:text-foreground";
    const sheetClasses = isSheet ? 'text-lg w-full justify-start' : '';

    const createLink = (href: string, text: string) => {
        const link = <Link href={href} className={`${commonClasses} ${sheetClasses}`}>{text}</Link>;
        return isSheet ? <SheetClose asChild>{link}</SheetClose> : link;
    }

    return (
        <>
            {createLink("/", "Toolkit")}
            {createLink("/learning-hub", "Learning Hub")}
            {createLink("/#pricing", "Pricing")}
            {createLink("/about", "About")}
        </>
    );
  };

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center">
        <div className="flex h-14 items-center justify-between gap-6 rounded-full border bg-background/60 p-2 px-6 text-sm font-medium backdrop-blur-sm">
            <div className="hidden md:flex">
                <Logo />
            </div>
            
             <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-background/80 backdrop-blur-xl">
                        <SheetClose asChild>
                            <Logo />
                        </SheetClose>
                        <Separator className="my-4" />
                        <nav className="grid gap-4 text-base font-medium">
                            {navLinks(true)}
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
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
                {navLinks()}
            </nav>

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
    </header>
  );
}
