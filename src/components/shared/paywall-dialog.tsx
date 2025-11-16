
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Zap } from "lucide-react";

interface PaywallDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaywallDialog({ isOpen, onOpenChange }: PaywallDialogProps) {
  const { user } = useAuth();
  
  const proCheckoutUrl = user
    ? `${process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_URL}?checkout[custom][user_id]=${user.uid}&checkout[email]=${user.email}`
    : `${process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_URL}`;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-primary" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-2xl">You've reached your monthly limit!</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            The free plan includes 5 AI generations per month. To continue creating unlimited resumes, cover letters, and job analyses, please upgrade to Pro.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
            <Button asChild size="lg">
                <Link href={proCheckoutUrl}>Upgrade to Pro</Link>
            </Button>
            <AlertDialogCancel asChild>
                <Button variant="ghost">Maybe Later</Button>
            </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
