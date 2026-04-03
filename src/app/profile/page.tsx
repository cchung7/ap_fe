"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Shield, User as UserIcon } from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { ProfileDashboardOverview } from "./_components/dashboard/ProfileDashboardOverview";
import { ProfilePageHero } from "./_components/ProfilePageHero";

type DashboardActivity = {
  id?: string | number;
  activityType?: string;
  description?: string;
  createdAt?: string | Date;
};

type LeaderboardPreviewEntry = {
  rank: number;
  name: string;
};

type MePayload = {
  name?: string;
  pointsTotal?: number;
  role?: string;
  status?: string;
  [key: string]: unknown;
};

type DashboardResponse = {
  me?: MePayload | null;
  stats?: {
    upcomingEvents?: number;
    totalPoints?: number;
    totalEventsAttended?: number;
    leaderboardRank?: number | null;
  };
  activities?: DashboardActivity[];
  leaderboardTopFivePreview?: LeaderboardPreviewEntry[];
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

function buildProfileBadges(me: any) {
  const role = String(me?.role || "MEMBER").toUpperCase();
  const status = String(me?.status || "PENDING").toUpperCase();

  const badges = [
    {
      key: "role",
      icon:
        role === "ADMIN" ? (
          <Shield size={13} className="text-accent" />
        ) : (
          <UserIcon size={13} className="text-primary" />
        ),
      label: role === "ADMIN" ? "Admin" : "Member",
    },
    {
      key: "status",
      icon:
        status === "ACTIVE" ? (
          <CheckCircle2 size={13} className="text-success" />
        ) : (
          <Clock size={13} className="text-warning" />
        ),
      label:
        status === "ACTIVE"
          ? "Active"
          : status === "SUSPENDED"
            ? "Suspended"
            : "Pending",
    },
  ];

  return badges;
}

export default function ProfileDashboardPage() {
  const router = useRouter();
  const { me, loading } = useMe();

  const [displayName, setDisplayName] = React.useState("Member");
  const [now, setNow] = React.useState(() => new Date());
  const [upcomingEvents, setUpcomingEvents] = React.useState(0);
  const [totalPoints, setTotalPoints] = React.useState(0);
  const [totalEventsAttended, setTotalEventsAttended] = React.useState(0);
  const [leaderboardRank, setLeaderboardRank] = React.useState<number | null>(null);
  const [leaderboardTopFivePreview, setLeaderboardTopFivePreview] = React.useState<
    LeaderboardPreviewEntry[]
  >([]);
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
        setTotalEventsAttended(Number(data?.stats?.totalEventsAttended ?? 0));
        setLeaderboardRank(
          typeof data?.stats?.leaderboardRank === "number"
            ? data.stats.leaderboardRank
            : null
        );
        setLeaderboardTopFivePreview(
          Array.isArray(data?.leaderboardTopFivePreview)
            ? data.leaderboardTopFivePreview
            : []
        );
        setActivities(Array.isArray(data?.activities) ? data.activities : []);
      } catch {
        if (!alive) return;
        setDisplayName(
          typeof me?.name === "string" && me.name.trim() ? me.name.trim() : "Member"
        );
        setUpcomingEvents(0);
        setTotalPoints(Number((me as any)?.pointsTotal ?? 0));
        setTotalEventsAttended(0);
        setLeaderboardRank(null);
        setLeaderboardTopFivePreview([]);
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
    <div className="relative space-y-5 overflow-hidden pt-5 pb-10 sm:space-y-6 sm:pt-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[20rem] bg-navy-wash opacity-75" />

      <ProfilePageHero
        eyebrow="Member Dashboard"
        title={`Welcome, ${displayName}`}
        subtitle={`${weekday}, ${fullDate}`}
        badges={buildProfileBadges(me)}
      />

      <ProfileDashboardOverview
        upcomingEvents={upcomingEvents}
        totalPoints={totalPoints}
        totalEventsAttended={totalEventsAttended}
        leaderboardRank={leaderboardRank}
        leaderboardTopFivePreview={leaderboardTopFivePreview}
        activities={activities}
      />
    </div>
  );
}