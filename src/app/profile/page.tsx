"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useMe } from "@/hooks/useMe";
import { ProfileDashboardOverview } from "./_components/dashboard/ProfileDashboardOverview";

type DashboardActivity = {
  id?: string | number;
  activityType?: string;
  description?: string;
  createdAt?: string | Date;
};

type MePayload = {
  name?: string;
  [key: string]: unknown;
};

type DashboardResponse = {
  me?: MePayload | null;
  stats?: {
    upcomingEvents?: number;
    totalPoints?: number;
  };
  activities?: DashboardActivity[];
};

function formatDashboardDate(date: Date) {
  const weekday = date.toLocaleDateString(undefined, { weekday: "long" });
  const fullDate = date.toLocaleDateString(undefined, {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  return { weekday, fullDate };
}

export default function ProfileDashboardPage() {
  const router = useRouter();
  const { me, loading } = useMe();

  const [displayName, setDisplayName] = React.useState("Member");
  const [now, setNow] = React.useState(() => new Date());
  const [upcomingEvents, setUpcomingEvents] = React.useState(0);
  const [totalPoints, setTotalPoints] = React.useState(0);
  const [activities, setActivities] = React.useState<DashboardActivity[]>([]);

  React.useEffect(() => {
    if (loading) return;
    if (me) return;
    router.replace("/login?next=/profile");
  }, [loading, me, router]);

  React.useEffect(() => {
    let alive = true;

    async function loadDashboard() {
      try {
        const res = await fetch("/api/me/dashboard", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const json = (await res.json().catch(() => ({}))) as {
          data?: DashboardResponse;
        };

        const data = json?.data ?? {};

        const resolvedName =
          typeof data?.me?.name === "string" && data.me.name.trim()
            ? data.me.name.trim()
            : typeof me?.name === "string" && me.name.trim()
              ? me.name.trim()
              : "Member";

        if (!alive) return;

        setDisplayName(resolvedName);
        setUpcomingEvents(Number(data?.stats?.upcomingEvents ?? 0));
        setTotalPoints(Number(data?.stats?.totalPoints ?? 0));
        setActivities(Array.isArray(data?.activities) ? data.activities : []);
      } catch {
        if (!alive) return;
        setDisplayName(
          typeof me?.name === "string" && me.name.trim() ? me.name.trim() : "Member"
        );
        setUpcomingEvents(0);
        setTotalPoints(Number((me as any)?.pointsTotal ?? 0));
        setActivities([]);
      }
    }

    if (!loading && me) {
      void loadDashboard();
    }

    return () => {
      alive = false;
    };
  }, [loading, me]);

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (loading || !me) return null;

  const { weekday, fullDate } = formatDashboardDate(now);

  return (
    <div className="space-y-5 pt-5 sm:pt-6">
      <div className="space-y-1">
        <h1 className="text-[1.7rem] sm:text-[1.95rem] font-black tracking-tight text-[#111827]">
          Welcome, {displayName}
        </h1>
        <p className="text-[13px] sm:text-sm text-[#6B7280]">
          {weekday}, {fullDate}
        </p>
      </div>

      <ProfileDashboardOverview
        upcomingEvents={upcomingEvents}
        totalPoints={totalPoints}
        activities={activities}
      />
    </div>
  );
}