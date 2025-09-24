
'use client';

import Link from "next/link";
import { LogOut, User as UserIcon, Menu, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "../ui/sheet";
import { Separator } from "../ui/separator";

const Logo = () => (
    <Link href="/" className="flex items-center">
        <span className="font-bold text-xl text-foreground">Crackresume</span>
    </Link>
)

export function Header() {
  const { user } = useAuth();
  
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

  const UserMenu = () => {
    const { logout } = useAuth();
    if (!user) return null;

    return (
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
    );
  };

  const AuthButtons = () => {
    if (user) return null;
    return (
        <div className="hidden sm:flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
                <Link href="/signup">Sign Up</Link>
            </Button>
        </div>
    );
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between gap-6 bg-background/60 p-2 px-6 text-sm font-medium backdrop-blur-sm md:mt-4 md:rounded-full md:border">
                {/* Left side: Logo */}
                <div className="flex-1 flex justify-start">
                    <div className="flex items-center md:hidden">
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
                     <div className="hidden md:flex">
                        <Logo />
                    </div>
                </div>

                {/* Center: Logo on mobile, Nav on Desktop */}
                <div className="flex-1 flex justify-center">
                    <div className="flex md:hidden">
                        <Logo />
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks()}
                    </nav>
                </div>
                

                {/* Right side: Auth buttons / User menu */}
                <div className="flex-1 flex justify-end items-center gap-2">
                    {user ? <UserMenu /> : <AuthButtons />}
                     <div className="sm:hidden">
                        {!user && 
                            <Button asChild size="icon" variant="ghost">
                                <Link href="/login"><UserIcon/></Link>
                            </Button>
                        }
                    </div>
                </div>
            </div>
        </div>
    </header>
  );
}
