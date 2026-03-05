// D:\ap_fe\src\components\ui\ProfileBadge.tsx
"use client";

import * as React from "react";

type BadgeVariant = "subRole" | "academicYear" | "major";

interface ProfileBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  title?: string;
}

export function ProfileBadge({
  variant,
  children,
  title,
}: ProfileBadgeProps) {
  let colorClasses = "";

  if (variant === "subRole") {
    colorClasses = `
      bg-[var(--accent)]/60
      border border-[var(--accent)]/30
      text-white
    `;
  }

  if (variant === "academicYear") {
    colorClasses = `
      bg-[var(--utd-green)]/55
      border border-[var(--utd-green)]/30
      text-white
    `;
  }

  if (variant === "major") {
    colorClasses = `
      bg-[var(--utd-orange)]/60
      border border-[var(--utd-orange)]/30
      text-white
    `;
  }

  return (
    <span
      title={title}
      className={`
        inline-flex items-center
        rounded-full
        px-2 py-[2px]
        text-[9px] font-black uppercase tracking-widest
        backdrop-blur-sm
        ${colorClasses}
      `}
    >
      {children}
    </span>
  );
}