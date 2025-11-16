
'use client';

import {
  AlertDialog,
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
import { Zap, Check, X } from "lucide-react";

interface PaywallDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const features = [
    { name: 'AI Generations', free: '5 per month', pro: 'Unlimited' },
    { name: 'Resume Optimizations', free: 'Limited', pro: 'Unlimited' },
    { name: 'Cover Letter Generation', free: 'Limited', pro: 'Unlimited' },
    { name: 'Job Tracker', free: true, pro: true },
    { name: 'Learning Hub Access', free: true, pro: true },
    { name: 'Priority Support', free: false, pro: true },
]

export function PaywallDialog({ isOpen, onOpenChange }: PaywallDialogProps) {
  const { user } = useAuth();
  
  const proCheckoutUrl = user
    ? `${process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_URL}?checkout[custom][user_id]=${user.uid}&checkout[email]=${user.email}`
    : `${process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_URL}`;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader className="items-center">
           <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Zap className="w-8 h-8 text-primary" />
            </div>
          <AlertDialogTitle className="text-center text-2xl font-bold">You've Used All Your Free Generations 🚀</AlertDialogTitle>
          <AlertDialogDescription className="text-center pb-4">
            Upgrade to Pro for unlimited AI-powered resume optimizations, cover letters, and job match analyses.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="border rounded-lg">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50">
                    <tr>
                        <th className="p-4 font-semibold">Feature</th>
                        <th className="p-4 font-semibold text-center">Free</th>
                        <th className="p-4 font-semibold text-center rounded-tr-lg bg-primary/10 text-primary">Pro</th>
                    </tr>
                </thead>
                <tbody>
                    {features.map((feature) => (
                        <tr key={feature.name} className="border-t">
                            <td className="p-3 font-medium">{feature.name}</td>
                            <td className="p-3 text-center text-muted-foreground">
                                {typeof feature.free === 'boolean' ? (
                                    feature.free ? <Check className="w-5 h-5 text-green-500 mx-auto"/> : <X className="w-5 h-5 text-red-500 mx-auto"/>
                                ) : (
                                    feature.free
                                )}
                            </td>
                             <td className="p-3 text-center font-semibold text-foreground bg-primary/5">
                                 {typeof feature.pro === 'boolean' ? (
                                    <Check className="w-5 h-5 text-green-500 mx-auto"/>
                                ) : (
                                    feature.pro
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2 mt-4">
            <Button asChild size="lg" className="w-full">
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
