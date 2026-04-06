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
        "min-w-0 overflow-hidden rounded-[1.2rem] border border-[rgba(11,45,91,0.10)]",
        "bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(244,247,252,0.98)_100%)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_12px_24px_-18px_rgba(11,18,32,0.14)]",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_18px_28px_-18px_rgba(11,18,32,0.18)]"
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
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] border border-white/60 sm:h-12 sm:w-12",
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