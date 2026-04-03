// D:\ap_fe\src\app\admin\_components\dashboard\DashboardMetricCard.tsx
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
    <div
      className={cn(
        "min-w-0 overflow-hidden rounded-[1.2rem] border border-border/70 bg-white shadow-sm",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-3 px-4 py-4 sm:px-5 sm:py-5">
        <div className="min-w-0 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-[12px]">
            {title}
          </p>

          <p className="text-[1.9rem] font-black leading-none tracking-tight text-foreground sm:text-[2.1rem]">
            {value}
          </p>
        </div>

        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] sm:h-12 sm:w-12",
            bgClassName
          )}
        >
          <div className="text-foreground/80 [&_svg]:h-5 [&_svg]:w-5 sm:[&_svg]:h-[1.1rem] sm:[&_svg]:w-[1.1rem]">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}