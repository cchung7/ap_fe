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

function normalizeMemberUser(raw: any): MemberUser | null {
  if (!raw || typeof raw !== "object") return null;

  const id = String(raw.id || raw._id || "").trim();
  const name = String(raw.name || "").trim();
  const email = String(raw.email || "").trim();
  const role = String(raw.role || "").trim();

  if (!id || !name || !email || !role) return null;

  return {
    id,
    name,
    email,
    role,
    subRole: raw.subRole ?? null,
    status: raw.status != null ? String(raw.status) : null,
    pointsTotal:
      typeof raw.pointsTotal === "number"
        ? raw.pointsTotal
        : raw.pointsTotal != null
          ? Number(raw.pointsTotal)
          : null,
    academicYear: raw.academicYear ?? null,
    major: raw.major ?? null,
    profileImageUrl: raw.profileImageUrl ?? null,
  };
}

function isVisibleMemberUser(user: MemberUser) {
  const status = String(user.status || "").toUpperCase();
  return status !== "PENDING" && status !== "SUSPENDED";
}

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

        const normalized = Array.isArray(list)
          ? (list.map(normalizeMemberUser).filter(Boolean) as MemberUser[])
          : [];

        setUsers(normalized);
      } catch {
        if (!alive) return;
        setUsers([]);
      } finally {
        if (!alive) return;
        setLoadingUsers(false);
      }
    }

    void runUsers();

    return () => {
      alive = false;
    };
  }, []);

  const visibleUsers = React.useMemo(
    () => users.filter(isVisibleMemberUser),
    [users]
  );

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 pt-32 pb-28 md:pb-36 sm:px-6 sm:pt-36 lg:px-8 space-y-20">
        <MembersHeroSection />

        <div className="max-w-6xl mx-auto w-full">
          {loadingUsers ? (
            <div className="rounded-2xl border-2 border-dashed border-border/40 bg-secondary/5 p-10 text-center text-sm text-muted-foreground">
              Loading members…
            </div>
          ) : visibleUsers.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-border/40 bg-secondary/5 p-10 text-center text-sm text-muted-foreground">
              No active members are available to display right now.
            </div>
          ) : (
            <MemberGrid users={visibleUsers as any} />
          )}
        </div>

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