"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DashboardMetricCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgClassName: string;
};

export function DashboardMetricCard({
  title,
  value,
  icon,
  bgClassName,
}: DashboardMetricCardProps) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden min-w-0">
      <div className="flex items-center justify-between px-4 py-5 sm:px-5 sm:py-6">
        <div className="space-y-2 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-[#4A5568] leading-snug">
            {title}
          </p>
          <p className="text-3xl sm:text-4xl font-black tracking-tight text-[#1F2937]">
            {value}
          </p>
        </div>

        <div
          className={cn(
            "h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center shrink-0",
            bgClassName
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}