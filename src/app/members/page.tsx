// D:\ap_fe\src\app\members\page.tsx 
// [Members Main Page]: High-level composition + fetch + loading state

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MemberGrid } from "@/components/members/MemberGrid";
import { MembersHeroSection } from "@/components/members/MembersHeroSection";

type MemberUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  subRole?: string | null;
  status?: string | null;
  pointsTotal?: number | null;
  academicYear?: string | null;
  major?: string | null;
  profileImageUrl?: string | null;
};

export default function MembersPage() {
  const [users, setUsers] = React.useState<MemberUser[]>([]);
  const [loadingUsers, setLoadingUsers] = React.useState(true);

  React.useEffect(() => {
    let alive = true;

    async function runUsers() {
      try {
        setLoadingUsers(true);

        const res = await fetch("/api/users", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const json = await res.json().catch(() => ({}));
        const list = (json as any)?.data ?? (json as any)?.users ?? [];

        if (!alive) return;
        setUsers(Array.isArray(list) ? list : []);
      } catch {
        if (!alive) return;
        setUsers([]);
      } finally {
        if (!alive) return;
        setLoadingUsers(false);
      }
    }

    runUsers();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 pt-32 pb-28 md:pb-36 sm:px-6 sm:pt-36 lg:px-8 space-y-20">
        <MembersHeroSection />

        {/* Centered content width */}
        <div className="max-w-6xl mx-auto w-full">
          {loadingUsers ? (
            <div className="rounded-2xl border-2 border-dashed border-border/40 bg-secondary/5 p-10 text-center text-sm text-muted-foreground">
              Loading members…
            </div>
          ) : (
            <MemberGrid
              users={Array.isArray(users) ? (users as any) : ([] as any)}
            />
          )}
        </div>

        {/* Back to Home */}
        <div className="pt-4 text-center">
          <Button
            asChild
            size="lg"
            className="rounded-full px-7 text-base font-semibold tracking-wide shadow-none transition-all hover:-translate-y-0.5 hover:bg-accent"
          >
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}