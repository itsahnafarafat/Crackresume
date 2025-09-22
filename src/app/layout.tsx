import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import Script from 'next/script';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Crackresume - ATS-Friendly Resume Generator',
  description: 'Paste your resume and a job description to get a rewritten, ATS-Friendly resume in seconds.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", "dark")} suppressHydrationWarning>
        <AuthProvider>
            {children}
            <Toaster />
        </AuthProvider>

        {/* Google Analytics Script */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-6NCSY7LRWR`} // 👈 replace with your Measurement ID
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6NCSY7LRWR'); 
          `}
        </Script>
      </body>
    </html>
  );
}
