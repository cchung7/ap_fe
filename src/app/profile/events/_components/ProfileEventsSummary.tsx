"use client";

import * as React from "react";
import {
  Award,
  BadgeCheck,
  CalendarDays,
  Clock3,
} from "lucide-react";

import { ProfileMetricCard } from "../../_components/dashboard/ProfileMetricCard";

type ProfileEventsSummaryProps = {
  totalEvents: number;
  upcomingEvents: number;
  checkedInEvents: number;
  totalPoints: number;
};

export function ProfileEventsSummary({
  totalEvents,
  upcomingEvents,
  checkedInEvents,
  totalPoints,
}: ProfileEventsSummaryProps) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <ProfileMetricCard
        title="Total Events"
        value={totalEvents}
        icon={<CalendarDays />}
        bgClassName="bg-slate-100"
      />

      <ProfileMetricCard
        title="Upcoming"
        value={upcomingEvents}
        icon={<Clock3 />}
        bgClassName="bg-blue-100"
      />

      <ProfileMetricCard
        title="Events Attended"
        value={checkedInEvents}
        icon={<BadgeCheck />}
        bgClassName="bg-violet-100"
      />

      <ProfileMetricCard
        title="Points Earned"
        value={totalPoints}
        icon={<Award />}
        bgClassName="bg-green-100"
      />
    </section>
  );
}