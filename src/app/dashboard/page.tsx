
'use client';

import { AuthGuard } from "@/components/auth-guard";
import { Header } from "@/components/shared/header";
import { UserProfile } from "@/components/user-profile";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-muted/40">
          <UserProfile />
        </main>
      </div>
    </AuthGuard>
  );
}
