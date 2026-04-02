"use client";

import * as React from "react";
import { CalendarDays, Award, BadgeCheck, Trophy, CircleHelp } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ProfileMetricCard } from "./ProfileMetricCard";
import { ProfileQuickActions } from "./ProfileQuickActions";
import { ProfileRecentActivity } from "./ProfileRecentActivity";

type ActivityLike = {
  id?: string | number;
  activityType?: string;
  description?: string;
  createdAt?: string | Date;
};

type LeaderboardPreviewEntry = {
  rank: number;
  name: string;
};

type ProfileDashboardOverviewProps = {
  upcomingEvents: number;
  totalPoints: number;
  totalEventsAttended: number;
  leaderboardRank: number | null;
  leaderboardTopFivePreview: LeaderboardPreviewEntry[];
  activities: ActivityLike[];
};

function LeaderboardTitle({
  leaderboardTopFivePreview,
}: {
  leaderboardTopFivePreview: LeaderboardPreviewEntry[];
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span>
        Current Rank
      </span>

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="View top 5 leaderboard"
            className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground"
          >
            <CircleHelp className="h-3.5 w-3.5" />
          </button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-72">
          <div className="space-y-2">
            <div>
              <p className="text-sm font-semibold text-foreground">Top 5 Leaderboard</p>
              <p className="text-xs text-muted-foreground">
                Ranked by total points among active members.
              </p>
            </div>

            <div className="space-y-1">
              {leaderboardTopFivePreview.length > 0 ? (
                leaderboardTopFivePreview.map((entry) => (
                  <div
                    key={`${entry.rank}-${entry.name}`}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span className="w-6 shrink-0 font-semibold text-muted-foreground">
                      #{entry.rank}
                    </span>
                    <span className="truncate">{entry.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Leaderboard preview unavailable.
                </p>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function ProfileDashboardOverview({
  upcomingEvents,
  totalPoints,
  totalEventsAttended,
  leaderboardRank,
  leaderboardTopFivePreview,
  activities,
}: ProfileDashboardOverviewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <ProfileMetricCard
          title={
            <LeaderboardTitle leaderboardTopFivePreview={leaderboardTopFivePreview} />
          }
          value={leaderboardRank !== null ? `#${leaderboardRank}` : "--"}
          icon={<Trophy />}
          bgClassName="bg-amber-100"
        />

        <ProfileMetricCard
          title="Total Points"
          value={totalPoints}
          icon={<Award />}
          bgClassName="bg-green-100"
        />

        <ProfileMetricCard
          title="Upcoming Events"
          value={upcomingEvents}
          icon={<CalendarDays />}
          bgClassName="bg-blue-100"
        />

        <ProfileMetricCard
          title="Events Attended"
          value={totalEventsAttended}
          icon={<BadgeCheck />}
          bgClassName="bg-violet-100"
        />

      </div>

      <ProfileQuickActions />

      <ProfileRecentActivity activities={activities} />
    </div>
  );
}