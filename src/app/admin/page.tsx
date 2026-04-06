"use client";

import * as React from "react";
import { Shield } from "lucide-react";

import { DashboardOverview } from "./_components/dashboard/DashboardOverview";
import { AdminPageHero } from "./_components/AdminPageHero";

type MePayload = {
  name?: string;
  subRole?: string | null;
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
  const [adminSubRole, setAdminSubRole] = React.useState("Admin");
  const [now, setNow] = React.useState(() => new Date());

  const [members, setMembers] = React.useState<Array<{ status?: string | null }>>([]);
  const [events, setEvents] = React.useState<Array<{ date?: string | Date | null }>>([]);
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

        const nextSubRole =
          typeof me?.subRole === "string" && me.subRole.trim()
            ? me.subRole.trim()
            : "Admin";

        if (!alive) return;
        setDisplayName(nextName);
        setAdminSubRole(nextSubRole);
      } catch {
        if (!alive) return;
        setDisplayName("Admin");
        setAdminSubRole("Admin");
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
    <div className="relative space-y-5 overflow-hidden pt-5 pb-10 sm:space-y-6 sm:pt-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[20rem] bg-navy-wash opacity-75" />

      <AdminPageHero
        eyebrow="Admin Workspace"
        title={`Welcome, ${displayName}`}
        subtitle={`${weekday}, ${fullDate}`}
        badges={[
          {
            key: "subRole",
            icon: <Shield size={13} className="text-accent" />,
            label: adminSubRole,
          },
        ]}
      />

      <DashboardOverview
        members={members}
        events={events}
        activities={activities}
      />
    </div>
  );
}