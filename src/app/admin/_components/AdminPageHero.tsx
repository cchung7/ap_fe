"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";

type HeroBadge = {
  key: string;
  icon?: React.ReactNode;
  label: string;
};

type AdminPageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  badges?: HeroBadge[];
  action?: React.ReactNode;
};

export function AdminPageHero({
  eyebrow,
  title,
  subtitle,
  badges = [],
  action,
}: AdminPageHeroProps) {
  return (
    <section className="rounded-[1.6rem] border border-border/60 bg-white/65 px-5 py-5 shadow-[0_18px_42px_-24px_rgba(11,18,32,0.16)] backdrop-blur-md sm:px-6 sm:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="space-y-1.5">
            {eyebrow ? (
              <p className="ui-eyebrow text-muted-foreground">{eyebrow}</p>
            ) : null}

            <h1 className="text-[2.25rem] font-black tracking-tight text-primary sm:text-[2.7rem] lg:text-[3rem]">
              {title}
            </h1>

            {subtitle ? (
              <p className="max-w-2xl text-[14px] leading-7 text-muted-foreground sm:text-[15px]">
                {subtitle}
              </p>
            ) : null}
          </div>

          {badges.length > 0 ? (
            <div className="flex flex-wrap gap-2.5 pt-1">
              {badges.map((badge) => (
                <Badge
                  key={badge.key}
                  variant="outline"
                  className="rounded-full border border-border/70 bg-white/85 px-3.5 py-1.5 text-[12px] font-semibold shadow-[0_8px_20px_-16px_rgba(11,18,32,0.18)]"
                >
                  <span className="inline-flex items-center gap-2">
                    {badge.icon}
                    {badge.label}
                  </span>
                </Badge>
              ))}
            </div>
          ) : null}
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </section>
  );
}