import { Header } from "@/components/shared/header";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col main-bg">
            <Header />
            <main className="flex-1 flex items-center justify-center relative z-10">
                {children}
            </main>
        </div>
    )
}
