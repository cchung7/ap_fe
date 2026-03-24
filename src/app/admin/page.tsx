// D:\ap_fe\src\app\admin\page.tsx
"use client";

import * as React from "react";

import { DashboardOverview } from "./_components/dashboard/DashboardOverview";

type MePayload = {
  name?: string;
  [key: string]: unknown;
};

type DashboardPayload = {
  members?: Array<{ status?: string | null }>;
  events?: Array<{ date?: string | Date | null }>;
  activities?: Array<{
    id?: string | number;
    activityType?: string;
    description?: string;
    createdAt?: string | Date;
  }>;
};

function formatAdminDate(date: Date) {
  const weekday = date.toLocaleDateString(undefined, { weekday: "long" });
  const fullDate = date.toLocaleDateString(undefined, {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  return { weekday, fullDate };
}

export default function AdminDashboardPage() {
  const [displayName, setDisplayName] = React.useState("Admin");
  const [now, setNow] = React.useState(() => new Date());

  const [members, setMembers] = React.useState<Array<{ status?: string | null }>>(
    []
  );
  const [events, setEvents] = React.useState<Array<{ date?: string | Date | null }>>(
    []
  );
  const [activities, setActivities] = React.useState<
    Array<{
      id?: string | number;
      activityType?: string;
      description?: string;
      createdAt?: string | Date;
    }>
  >([]);

  React.useEffect(() => {
    let alive = true;

    async function loadMe() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const json = (await res.json().catch(() => ({}))) as {
          data?: { me?: MePayload | null };
          me?: MePayload | null;
        };

        const me = (json?.data?.me ?? json?.me ?? null) as MePayload | null;
        const nextName =
          typeof me?.name === "string" && me.name.trim()
            ? me.name.trim()
            : "Admin";

        if (!alive) return;
        setDisplayName(nextName);
      } catch {
        if (!alive) return;
        setDisplayName("Admin");
      }
    }

    async function loadDashboard() {
      try {
        const res = await fetch("/api/admin/dashboard", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const json = (await res.json().catch(() => ({}))) as {
          data?: DashboardPayload;
        };

        const data = json?.data ?? {};

        if (!alive) return;
        setMembers(Array.isArray(data.members) ? data.members : []);
        setEvents(Array.isArray(data.events) ? data.events : []);
        setActivities(Array.isArray(data.activities) ? data.activities : []);
      } catch {
        if (!alive) return;
        setMembers([]);
        setEvents([]);
        setActivities([]);
      }
    }

    void loadMe();
    void loadDashboard();

    return () => {
      alive = false;
    };
  }, []);

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const { weekday, fullDate } = formatAdminDate(now);

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

      <DashboardOverview
        members={members}
        events={events}
        activities={activities}
      />
    </div>
  );
}