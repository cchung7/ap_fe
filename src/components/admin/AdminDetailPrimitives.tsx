"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type AdminDetailCardShellProps = {
  title: string;
  eyebrow?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function AdminDetailCardShell({
  title,
  eyebrow,
  icon,
  children,
  className,
  bodyClassName,
}: AdminDetailCardShellProps) {
  return (
    <section
      className={cn(
        "relative min-w-0 overflow-hidden rounded-[1.35rem] border-2 border-[rgba(11,45,91,0.18)] bg-white shadow-[0_24px_60px_-28px_rgba(11,18,32,0.26),0_14px_28px_-22px_rgba(11,45,91,0.22)] ring-1 ring-white",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] border border-white/70" />
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,rgba(11,45,91,0.85)_0%,rgba(177,18,38,0.85)_100%)]" />

      <div className="relative border-b border-[rgba(11,45,91,0.12)] bg-[linear-gradient(180deg,rgba(238,243,251,0.92)_0%,rgba(255,255,255,1)_100%)] px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          {icon ? (
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[rgba(11,45,91,0.12)] bg-white text-primary shadow-[0_10px_24px_-16px_rgba(11,18,32,0.22)]">
              {icon}
            </div>
          ) : null}

          <div className="min-w-0">
            {eyebrow ? (
              <p className="ui-eyebrow text-muted-foreground">{eyebrow}</p>
            ) : null}

            <h3 className="mt-1 text-[1.05rem] font-black tracking-tight text-foreground">
              {title}
            </h3>
          </div>
        </div>
      </div>

      <div className={cn("relative bg-white px-4 py-4 sm:px-5 sm:py-5", bodyClassName)}>
        {children}
      </div>
    </section>
  );
}

export function AdminInfoItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-[1rem] border border-[rgba(11,45,91,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,249,252,0.98)_100%)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_20px_-18px_rgba(11,18,32,0.14)]">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/80">
        {label}
      </p>
      <p className="mt-1 break-words text-[0.96rem] font-medium leading-7 text-foreground">
        {value}
      </p>
    </div>
  );
}

export function AdminStatTile({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-[1.15rem] border border-[rgba(11,45,91,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,247,252,0.96)_100%)] px-4 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_12px_24px_-18px_rgba(11,18,32,0.14)]">
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 break-words text-[2rem] font-black leading-none tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}