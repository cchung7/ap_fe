"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ProfileMetricCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgClassName: string;
};

export function ProfileMetricCard({
  title,
  value,
  icon,
  bgClassName,
}: ProfileMetricCardProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded-[1.15rem] border border-border/70 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 sm:px-5 sm:py-5">
        <div className="min-w-0 space-y-1.5">
          <p className="text-[11px] sm:text-[12px] font-medium leading-snug text-muted-foreground">
            {title}
          </p>

          <p className="text-[1.75rem] sm:text-[2rem] font-black tracking-tight leading-none text-foreground">
            {value}
          </p>
        </div>

        <div
          className={cn(
            "flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-[1rem]",
            bgClassName
          )}
        >
          <div className="text-foreground/80 [&_svg]:h-5 [&_svg]:w-5 sm:[&_svg]:h-[1.15rem] sm:[&_svg]:w-[1.15rem]">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}