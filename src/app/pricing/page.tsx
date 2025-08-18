
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/header';

const plans = [
  {
    name: 'Free',
    price: '$0',
    priceId: null,
    features: ['3 Resume Generations per day', 'Full Job Tracker Access'],
    isCurrent: true,
  },
  {
    name: 'Monthly',
    price: '$10/month',
    priceId: 'price_YOUR_MONTHLY_PRICE_ID', // Replace with your actual price ID
    features: ['Unlimited Resume Generations', 'Full Job Tracker Access', 'Priority Support'],
  },
  {
    name: 'Yearly',
    price: '$100/year',
    priceId: 'price_YOUR_YEARLY_PRICE_ID', // Replace with your actual price ID
    features: ['Unlimited Resume Generations', 'Full Job Tracker Access', 'Priority Support', 'Save 16%'],
  },
];

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null) => {
    if (!user) {
      router.push('/login?redirect=/pricing');
      return;
    }
    if (!priceId) return;

    setLoading(priceId);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, userId: user.uid, email: user.email }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(null);
    }
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
                            onClick={() => handleSubscribe(plan.priceId)}
                            disabled={!!loading}
                            variant={plan.name === 'Free' ? 'outline' : 'default'}
                        >
                            {loading === plan.priceId ? 'Processing...' : plan.name === 'Free' ? 'Your Current Plan' : 'Subscribe'}
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
