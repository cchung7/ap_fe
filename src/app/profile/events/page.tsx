"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Shield,
  User as UserIcon,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { ProfilePageHero } from "../_components/ProfilePageHero";
import { ProfileEventsSummary } from "./_components/ProfileEventsSummary";
import { ProfileEventsSection } from "./_components/ProfileEventsSection";
import type {
  AttendanceRow,
  AttendancesResponse,
} from "./_components/profileEvents.types";
import {
  buildProfileEventSummary,
  splitAttendanceRows,
} from "./_components/profileEvents.utils";

function buildProfileBadges(me: any) {
  const role = String(me?.role || "MEMBER").toUpperCase();
  const status = String(me?.status || "PENDING").toUpperCase();

  return [
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
}

export default function ProfileEventsPage() {
  const router = useRouter();
  const { me, loading } = useMe();

  const [rows, setRows] = React.useState<AttendanceRow[]>([]);
  const [loadingRows, setLoadingRows] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (loading) return;
    if (me) return;
    router.replace("/login?next=/profile/events");
  }, [loading, me, router]);

  React.useEffect(() => {
    let alive = true;

    async function loadAttendances() {
      try {
        setLoadingRows(true);
        setError(null);

        const res = await fetch("/api/me/attendances", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const json = (await res.json().catch(() => null)) as AttendancesResponse | null;

        if (!res.ok || !json?.success) {
          throw new Error(json?.message || "Failed to fetch your events");
        }

        if (!alive) return;
        setRows(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Failed to fetch your events");
        setRows([]);
      } finally {
        if (!alive) return;
        setLoadingRows(false);
      }
    }

    if (!loading && me) {
      void loadAttendances();
    }

    return () => {
      alive = false;
    };
  }, [loading, me]);

  const { upcoming, past } = React.useMemo(() => splitAttendanceRows(rows), [rows]);
  const summary = React.useMemo(() => buildProfileEventSummary(rows), [rows]);

  if (loading || !me) return null;

  return (
    <div className="relative space-y-5 overflow-hidden pt-5 pb-10 sm:space-y-6 sm:pt-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[20rem] bg-navy-wash opacity-75" />

      <ProfilePageHero
        eyebrow="Member Activity"
        title="My Events"
        subtitle="Review your registrations, upcoming schedule, check-ins, and points earned."
        badges={buildProfileBadges(me)}
      />

      <ProfileEventsSummary
        totalEvents={summary.totalEvents}
        upcomingEvents={summary.upcomingEvents}
        checkedInEvents={summary.checkedInEvents}
        totalPoints={summary.totalPoints}
      />

      <div className="flex flex-col gap-5 sm:gap-6">
        <ProfileEventsSection
          title="Upcoming"
          description="Events you are currently registered for and have not yet completed."
          rows={upcoming}
          loading={loadingRows}
          error={error}
          emptyMessage="You do not have any upcoming event activity right now."
          emptyCtaHref="/events"
          emptyCtaLabel="Browse Events"
        />

        <ProfileEventsSection
          title="Past Activity"
          description="Your attended, missed, and canceled event history."
          rows={past}
          loading={loadingRows}
          error={error}
          emptyMessage="Your past event activity will appear here once you begin registering."
          emptyCtaHref="/events"
          emptyCtaLabel="Explore Events"
        />
      </div>
    </div>
  );
}