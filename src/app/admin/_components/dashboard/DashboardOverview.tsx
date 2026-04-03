// D:\ap_fe\src\app\admin\_components\dashboard\DashboardOverview.tsx
"use client";

import * as React from "react";
import { CalendarDays, ClipboardList, UserPlus, Users } from "lucide-react";

import { DashboardMetricCard } from "./DashboardMetricCard";
import { DashboardQuickActions } from "./DashboardQuickActions";
import { DashboardRecentActivity } from "./DashboardRecentActivity";

type MemberLike = {
  status?: string | null;
};

type EventLike = {
  date?: string | Date | null;
};

type ActivityLike = {
  id?: string | number;
  activityType?: string;
  description?: string;
  createdAt?: string | Date;
};

type DashboardOverviewProps = {
  members: MemberLike[];
  events: EventLike[];
  activities: ActivityLike[];
};

function normalizeStatus(value: string | null | undefined) {
  return (value || "").trim().toUpperCase();
}

export function DashboardOverview({
  members,
  events,
  activities,
}: DashboardOverviewProps) {
  const stats = React.useMemo(() => {
    const now = Date.now();

    const upcomingEvents = (Array.isArray(events) ? events : []).filter((event) => {
      const t = new Date(event?.date || "").getTime();
      return Number.isFinite(t) && t >= now;
    }).length;

    const activeMembers = (Array.isArray(members) ? members : []).filter((member) => {
      const status = normalizeStatus(member?.status);
      return status === "ACTIVE" || status === "APPROVED";
    }).length;

    const pendingMembers = (Array.isArray(members) ? members : []).filter((member) => {
      const status = normalizeStatus(member?.status);
      return status === "PENDING";
    }).length;

    const totalMembers = activeMembers + pendingMembers;

    return {
      upcomingEvents,
      totalMembers,
      activeMembers,
      pendingMembers,
    };
  }, [members, events]);

  return (
    <div className="flex flex-col gap-5">
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.95fr)] xl:items-stretch">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[1.2rem] border border-border/70 bg-white shadow-sm">
          <div className="border-b border-border/70 px-5 py-4">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
              Overview
            </p>
            <h2 className="mt-1 text-[1.02rem] font-semibold tracking-tight text-foreground">
              Dashboard Snapshot
            </h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              A quick view of current membership and event activity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5">
            <DashboardMetricCard
              title="Upcoming Events"
              value={stats.upcomingEvents}
              icon={<CalendarDays />}
              bgClassName="bg-blue-100"
            />

            <DashboardMetricCard
              title="Total Members"
              value={stats.totalMembers}
              icon={<Users />}
              bgClassName="bg-slate-200"
            />

            <DashboardMetricCard
              title="Active Members"
              value={stats.activeMembers}
              icon={<ClipboardList />}
              bgClassName="bg-green-100"
            />

            <DashboardMetricCard
              title="Pending Members"
              value={stats.pendingMembers}
              icon={<UserPlus />}
              bgClassName="bg-orange-100"
            />
          </div>
        </div>

        <DashboardQuickActions />
      </section>

      <DashboardRecentActivity activities={activities} />
    </div>
  );
}