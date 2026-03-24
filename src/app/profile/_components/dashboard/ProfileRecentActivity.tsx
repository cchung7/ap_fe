"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollText, X } from "lucide-react";

type Activity = {
  id?: string | number;
  activityType?: string;
  description?: string;
  createdAt?: string | Date;
};

type ProfileRecentActivityProps = {
  activities: Activity[];
};

function getDotColor(activityType: string) {
  const type = activityType.toUpperCase();

  if (type.includes("CHECKIN")) return "bg-orange-500";
  if (type.includes("REGISTERED")) return "bg-blue-500";
  if (type.includes("EVENT")) return "bg-green-500";

  return "bg-gray-400";
}

function getTimestampValue(value?: string | Date) {
  const time = new Date(value || 0).getTime();
  return Number.isFinite(time) ? time : 0;
}

function formatActivityDate(value?: string | Date) {
  const date = new Date(value || Date.now());
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString();
}

export function ProfileRecentActivity({
  activities,
}: ProfileRecentActivityProps) {
  const [open, setOpen] = React.useState(false);

  const sortedActivities = React.useMemo(() => {
    return [...(Array.isArray(activities) ? activities : [])].sort(
      (a, b) => getTimestampValue(b.createdAt) - getTimestampValue(a.createdAt)
    );
  }, [activities]);

  const previewList = React.useMemo(
    () => sortedActivities.slice(0, 3),
    [sortedActivities]
  );
  const hasMoreLogs = sortedActivities.length > previewList.length;

  return (
    <div className="overflow-hidden rounded-[1.15rem] border border-border/70 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-3.5">
        <h2 className="text-base font-semibold text-foreground">
          Recent Activity
        </h2>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              size="sm"
              className={cn(
                "group h-8 rounded-xl border px-3 text-[10px] font-black uppercase tracking-[0.16em]",
                "ui-surface-silver border-accent/30 bg-white/95 text-foreground",
                "hover:border-accent/55 hover:-translate-y-0.5 hover:bg-white",
                "shadow-[0_10px_24px_-16px_rgba(11,18,32,0.24)] transition-all"
              )}
            >
              <ScrollText className="mr-1 h-3.5 w-3.5 shrink-0 text-accent" />
              <span className="text-foreground">Activity Log</span>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            side="bottom"
            sideOffset={12}
            collisionPadding={16}
            className={cn(
              "w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[1.35rem] p-0",
              "border-2 border-[rgba(11,45,91,0.28)] bg-white",
              "shadow-[0_32px_90px_-24px_rgba(11,18,32,0.42),0_18px_36px_-22px_rgba(11,45,91,0.30)]",
              "ring-1 ring-white",
              "before:pointer-events-none before:absolute before:inset-0 before:rounded-[1.35rem] before:border before:border-white/70 before:content-['']"
            )}
          >
            <div className="relative border-b border-[rgba(11,45,91,0.14)] bg-[linear-gradient(180deg,rgba(238,243,251,0.92)_0%,rgba(255,255,255,1)_100%)] px-4 py-3.5 sm:px-5">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,rgba(11,45,91,0.85)_0%,rgba(177,18,38,0.85)_100%)]" />

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.20em] text-muted-foreground">
                    Activity Logs
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <h3 className="text-[1.02rem] font-black tracking-tight text-foreground">
                      Recent History
                    </h3>

                    <div className="rounded-lg border border-[rgba(11,45,91,0.16)] bg-white px-2 py-[3px] text-[10px] font-black uppercase tracking-[0.12em] text-primary shadow-[0_8px_20px_-16px_rgba(11,18,32,0.28)]">
                      {sortedActivities.length}
                    </div>
                  </div>

                  <p className="mt-1 text-[12px] text-muted-foreground">
                    Most recent entries shown first.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all",
                    "ui-surface-silver border-border/70 text-muted-foreground",
                    "shadow-[0_8px_20px_-16px_rgba(11,18,32,0.28)]",
                    "hover:border-accent/45 hover:text-accent"
                  )}
                  aria-label="Close activity log"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[min(26rem,60vh)] overflow-y-auto bg-white">
              {sortedActivities.length === 0 ? (
                <div className="px-4 py-4 sm:px-5">
                  <p className="text-[13px] text-muted-foreground">
                    No activity has been recorded yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[rgba(11,45,91,0.10)]">
                  {sortedActivities.map((activity, index) => (
                    <div
                      key={activity.id ?? index}
                      className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-secondary/30 sm:px-5"
                    >
                      <div
                        className={cn(
                          "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_0_4px_rgba(255,255,255,0.92)]",
                          getDotColor(activity.activityType || "GENERAL")
                        )}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="break-words text-[0.93rem] font-medium leading-snug text-foreground">
                          {activity.description || "Activity recorded"}
                        </p>
                        <span className="mt-1 block text-[12px] text-muted-foreground">
                          {formatActivityDate(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="divide-y divide-[#E2E8F0]">
        {previewList.length === 0 ? (
          <div className="px-5 py-4.5">
            <p className="text-[13px] text-[#718096]">
              No recent activity has been recorded yet.
            </p>
          </div>
        ) : (
          previewList.map((activity, index) => (
            <div
              key={activity.id ?? index}
              className="flex items-start gap-3.5 px-5 py-4.5 transition-colors hover:bg-gray-50"
            >
              <div
                className={cn(
                  "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                  getDotColor(activity.activityType || "GENERAL")
                )}
              />

              <div className="flex min-w-0 flex-col gap-1">
                <p className="break-words text-[0.95rem] font-medium leading-snug text-[#2D3748]">
                  {activity.description || "Activity recorded"}
                </p>
                <span className="text-[12px] text-[#718096]">
                  {formatActivityDate(activity.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {hasMoreLogs && (
        <div className="border-t border-[#E2E8F0] px-5 py-3">
          <p className="text-[12px] text-muted-foreground">
            Showing 4 most recent logs. Select{" "}
            <span className="font-semibold text-foreground">Activity Log</span>{" "}
            to view the full history.
          </p>
        </div>
      )}
    </div>
  );
}