import { Header } from "@/components/shared/header";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-muted/40">
            <Header />
            <main className="flex-1 flex items-center justify-center">
                {children}
            </main>
        </div>
    )
}