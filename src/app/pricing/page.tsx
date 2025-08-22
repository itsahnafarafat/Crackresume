
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/header';

// IMPORTANT: Replace these with your actual Lemon Squeezy checkout links
const plans = [
  {
    name: 'Free',
    price: '$0',
    checkoutUrl: null,
    features: ['3 Resume Generations per day', 'Full Job Tracker Access'],
    isCurrent: true,
  },
  {
    name: 'Monthly',
    price: '$10/month',
    checkoutUrl: 'https://skillsyncpro.lemonsqueezy.com/buy/f057d01c-5650-4b4a-960a-65b1868b65c7', // Replace with your actual checkout link
    features: ['Unlimited Resume Generations', 'Full Job Tracker Access', 'Priority Support'],
  },
  {
    name: 'Yearly',
    price: '$100/year',
    checkoutUrl: 'https://skillsyncpro.lemonsqueezy.com/buy/5bc9af3a-2c55-47ba-9b46-01f4c2ef3606?discount=0', // Replace with your actual checkout link
    features: ['Unlimited Resume Generations', 'Full Job Tracker Access', 'Priority Support', 'Save 16%'],
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubscribe = (checkoutUrl: string | null) => {
    if (!user) {
      router.push('/login?redirect=/pricing');
      return;
    }
    if (!checkoutUrl) return;

    // Append user data to the checkout URL so we can identify the user in the webhook
    const urlWithCheckoutData = `${checkoutUrl}?checkout[custom][user_id]=${user.uid}&checkout[email]=${user.email}`;
    
    window.location.href = urlWithCheckoutData;
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
        <Header />
        <main className="flex-1">
             <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Find the perfect plan</h1>
                    <p className="mt-4 text-xl text-muted-foreground">
                        Start for free and upgrade to unlock unlimited power.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan) => (
                    <Card key={plan.name} className="flex flex-col shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <CardDescription className="text-4xl font-bold">{plan.price}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                        <ul className="space-y-4">
                            {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <span>{feature}</span>
                            </li>
                            ))}
                        </ul>
                        </CardContent>
                        <CardFooter>
                        <Button
                            className="w-full"
                            onClick={() => handleSubscribe(plan.checkoutUrl)}
                            disabled={user?.subscriptionStatus === 'active' && plan.name !== 'Free'}
                            variant={plan.name === 'Free' ? 'outline' : 'default'}
                        >
                            {plan.name === 'Free' ? 'Your Current Plan' : 'Subscribe'}
                        </Button>
                        </CardFooter>
                    </Card>
                    ))}
                </div>
            </div>
        </main>
    </div>
  );
}
