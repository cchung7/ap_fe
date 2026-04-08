"use client";

import * as React from "react";
import { CalendarDays, Clock3, Ticket, Users } from "lucide-react";

import { DashboardMetricCard } from "../../_components/dashboard/DashboardMetricCard";

type EventsOverviewProps = {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalRegistrations: number;
};

export function EventsOverview({
  totalEvents,
  upcomingEvents,
  completedEvents,
  totalRegistrations,
}: EventsOverviewProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-[1.55rem] border border-border/60 bg-white/72 shadow-master backdrop-blur-md">
      <div className="border-b border-border/60 px-5 py-4.5 sm:px-6 sm:py-5">
        <p className="ui-eyebrow text-muted-foreground">Overview</p>
        <h2 className="mt-1 text-[1.28rem] font-black tracking-tight text-foreground">
          Events Snapshot
        </h2>
        <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
          A quick operational view of upcoming schedules, completed events, and registration volume.
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4 sm:p-5">
        <DashboardMetricCard
          title="Upcoming Events"
          value={upcomingEvents}
          icon={<CalendarDays />}
          bgClassName="bg-blue-100"
        />

        <DashboardMetricCard
          title="Past Events"
          value={completedEvents}
          icon={<Clock3 />}
          bgClassName="bg-slate-200"
        />

        <DashboardMetricCard
          title="Total Events"
          value={totalEvents}
          icon={<Ticket />}
          bgClassName="bg-violet-100"
        />

        <DashboardMetricCard
          title="Registrations"
          value={totalRegistrations}
          icon={<Users />}
          bgClassName="bg-green-100"
        />
      </div>
    </section>
  );
}