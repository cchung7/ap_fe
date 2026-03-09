"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Activity = {
  id?: string | number;
  activityType?: string;
  description?: string;
  createdAt?: string | Date;
};

type DashboardRecentActivityProps = {
  activities: Activity[];
};

function getDotColor(activityType: string) {
  const type = activityType.toUpperCase();

  if (type.includes("EVENT")) return "bg-green-500";
  if (type.includes("USER")) return "bg-blue-500";
  if (type.includes("CHECKIN")) return "bg-orange-500";

  return "bg-gray-400";
}

export function DashboardRecentActivity({
  activities,
}: DashboardRecentActivityProps) {
  const list = Array.isArray(activities) ? activities.slice(0, 6) : [];

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E2E8F0]">
        <h2 className="text-lg font-semibold text-[#2D3748]">
          Recent Activity
        </h2>
      </div>

      <div className="divide-y divide-[#E2E8F0]">
        {list.length === 0 ? (
          <div className="px-6 py-5">
            <p className="text-sm text-[#718096]">
              No recent activity has been recorded yet.
            </p>
          </div>
        ) : (
          list.map((activity, index) => (
            <div
              key={activity.id ?? index}
              className="px-6 py-5 flex items-start gap-4 hover:bg-gray-50 transition-colors"
            >
              <div
                className={cn(
                  "w-2.5 h-2.5 rounded-full mt-1.5 shrink-0",
                  getDotColor(activity.activityType || "GENERAL")
                )}
              />

              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-[#2D3748] font-medium leading-tight break-words">
                  {activity.description || "Activity recorded"}
                </p>
                <span className="text-sm text-[#718096]">
                  {new Date(activity.createdAt || Date.now()).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}