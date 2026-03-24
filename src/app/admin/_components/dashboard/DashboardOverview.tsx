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
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
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

      <DashboardQuickActions />

      <DashboardRecentActivity activities={activities} />
    </div>
  );
}