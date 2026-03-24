"use client";

import * as React from "react";
import { CalendarDays, Award } from "lucide-react";

import { ProfileMetricCard } from "./ProfileMetricCard";
import { ProfileRecentActivity } from "./ProfileRecentActivity";

type ActivityLike = {
  id?: string | number;
  activityType?: string;
  description?: string;
  createdAt?: string | Date;
};

type ProfileDashboardOverviewProps = {
  upcomingEvents: number;
  totalPoints: number;
  activities: ActivityLike[];
};

export function ProfileDashboardOverview({
  upcomingEvents,
  totalPoints,
  activities,
}: ProfileDashboardOverviewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ProfileMetricCard
          title="Upcoming Events"
          value={upcomingEvents}
          icon={<CalendarDays />}
          bgClassName="bg-blue-100"
        />

        <ProfileMetricCard
          title="Total Points"
          value={totalPoints}
          icon={<Award />}
          bgClassName="bg-green-100"
        />
      </div>

      <ProfileRecentActivity activities={activities} />
    </div>
  );
}