
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

const pricingTiers = [
    {
        name: "Free",
        price: "$0",
        period: "/ month",
        description: "For individuals just getting started.",
        features: [
            "10 Resume Generations / month",
            "10 Job Match Analyses / month",
            "Basic Job Tracker",
            "Access to Learning Hub",
        ],
        cta: "Get Started for Free",
        href: "/signup",
        isFeatured: false,
    },
    {
        name: "Pro",
        price: "$19",
        period: "/ month",
        description: "For serious job seekers who need an edge.",
        features: [
            "Unlimited Resume Generations",
            "Unlimited Job Match Analyses",
            "Unlimited Cover Letter Generations",
            "Advanced Job Tracker",
            "Priority Support",
            "Early access to new features"
        ],
        cta: "Go Pro",
        href: "#", // Replace with your payment link
        isFeatured: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "For career coaches and organizations.",
        features: [
            "Everything in Pro",
            "Multi-user management",
            "Custom branding",
            "Dedicated Account Manager",
            "API Access",
        ],
        cta: "Contact Sales",
        href: "#", // Replace with your contact link
        isFeatured: false,
    }
];

export default function PricingPage() {
    return (
        <div className="flex min-h-screen flex-col main-bg">
            <Header />
            <main className="flex-1 relative z-10 pt-28">
                <div className="container mx-auto py-12 px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center animate-in fade-in-50 slide-in-from-top-8 duration-1000">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Simple, transparent pricing</h1>
                        <p className="mt-6 text-xl text-muted-foreground">
                            Choose the plan that's right for you. Unlock your career potential today.
                        </p>
                    </div>

                    <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {pricingTiers.map((tier, index) => (
                            <Card key={tier.name} className={`flex flex-col bg-card/80 backdrop-blur-sm border-white/10 ${tier.isFeatured ? 'border-primary/50 shadow-2xl shadow-primary/10' : ''} animate-in fade-in-50 slide-in-from-bottom-12 duration-1000`} style={{animationDelay: `${index * 200}ms`}}>
                                <CardHeader className="p-6">
                                    <h3 className="text-lg font-semibold text-primary">{tier.name}</h3>
                                    <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">{tier.price}<span className="text-lg font-normal text-muted-foreground">{tier.period}</span></p>
                                    <CardDescription className="mt-3">{tier.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 p-6 pt-0">
                                    <ul className="space-y-4 text-sm text-muted-foreground">
                                        {tier.features.map(feature => (
                                            <li key={feature} className="flex items-center">
                                                <Check className="h-4 w-4 mr-2 text-primary" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter className="p-6">
                                    <Button asChild className="w-full" variant={tier.isFeatured ? 'default' : 'outline'}>
                                        <Link href={tier.href}>{tier.cta}</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
            <footer className="flex items-center justify-center py-6 md:py-8 w-full border-t border-white/5 relative z-10">
                <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Crackresume. All rights reserved.</p>
            </footer>
        </div>
    );
}
