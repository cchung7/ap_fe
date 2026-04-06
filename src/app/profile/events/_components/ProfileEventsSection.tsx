"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
  Trophy,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type {
  ProfileEventDisplayStatus,
  ProfileEventItem,
} from "./profileEvents.types";

type ProfileEventsSectionProps = {
  title: string;
  description: string;
  rows: ProfileEventItem[];
  loading: boolean;
  error: string | null;
  emptyMessage: string;
  emptyCtaHref?: string;
  emptyCtaLabel?: string;
};

function StatusBadge({ status }: { status: ProfileEventDisplayStatus }) {
  const config =
    status === "ATTENDED"
      ? {
          label: "Checked In",
          classes: "border-green-200 bg-green-50 text-green-700",
        }
      : status === "UPCOMING"
        ? {
            label: "Registered",
            classes: "border-blue-200 bg-blue-50 text-blue-700",
          }
        : {
            label: "Canceled",
            classes: "border-slate-200 bg-slate-50 text-slate-700",
          };

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em]",
        config.classes
      )}
    >
      {config.label}
    </span>
  );
}

function EmptyState({
  message,
  ctaHref,
  ctaLabel,
}: {
  message: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="rounded-[1.2rem] border border-dashed border-border/70 bg-white/60 px-5 py-10 text-center">
      <div className="mx-auto max-w-xl space-y-3">
        <p className="text-[13px] leading-6 text-muted-foreground">{message}</p>

        {ctaHref && ctaLabel ? (
          <Button asChild className="rounded-2xl">
            <Link href={ctaHref} className="inline-flex items-center gap-2">
              {ctaLabel}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function MobileEventCard({ row }: { row: ProfileEventItem }) {
  return (
    <article className="overflow-hidden rounded-[1.2rem] border border-border/60 bg-white/72 shadow-master backdrop-blur-md">
      <div className="flex items-start justify-between gap-3 border-b border-border/60 px-4 py-4">
        <div className="min-w-0">
          <p className="truncate text-[1rem] font-black tracking-tight text-foreground">
            {row.title}
          </p>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            {row.categoryLabel}
          </p>
        </div>

        <StatusBadge status={row.displayStatus} />
      </div>

      <div className="grid gap-3 px-4 py-4 sm:grid-cols-2">
        <div className="flex items-start gap-2.5">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Date
            </p>
            <p className="text-[13px] text-foreground">{row.dateLabel}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Time
            </p>
            <p className="text-[13px] text-foreground">{row.timeLabel}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Location
            </p>
            <p className="text-[13px] text-foreground">{row.locationLabel}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Registered
            </p>
            <p className="text-[13px] text-foreground">{row.registeredAtLabel}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 sm:col-span-2">
          <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Points
            </p>
            <p className="text-[13px] text-foreground">
              {row.earnedPoints}
              {row.displayStatus === "UPCOMING" && row.possiblePoints > 0
                ? ` / ${row.possiblePoints} possible`
                : ""}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function DesktopEventRow({ row }: { row: ProfileEventItem }) {
  return (
    <div className="grid grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-4 border-t border-border/60 px-5 py-4 first:border-t-0">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-[0.98rem] font-black tracking-tight text-foreground">
            {row.title}
          </p>
          <StatusBadge status={row.displayStatus} />
        </div>

        <p className="mt-1 text-[13px] text-muted-foreground">{row.categoryLabel}</p>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[13px] text-foreground">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span>{row.dateLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <Clock3 className="h-4 w-4 text-primary" />
          <span>{row.timeLabel}</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[13px] text-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="truncate">{row.locationLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <Ticket className="h-4 w-4 text-primary" />
          <span>Registered {row.registeredAtLabel}</span>
        </div>
      </div>

      <div className="text-right">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Points
        </p>
        <p className="text-[1rem] font-black tracking-tight text-foreground">
          {row.earnedPoints}
          {row.displayStatus === "UPCOMING" && row.possiblePoints > 0 ? (
            <span className="ml-1 text-[13px] font-medium text-muted-foreground">
              / {row.possiblePoints}
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}

export function ProfileEventsSection({
  title,
  description,
  rows,
  loading,
  error,
  emptyMessage,
  emptyCtaHref,
  emptyCtaLabel,
}: ProfileEventsSectionProps) {
  return (
    <section className="overflow-hidden rounded-[1.55rem] border border-border/60 bg-white/72 shadow-master backdrop-blur-md">
      <div className="border-b border-border/60 px-5 py-4.5 sm:px-6 sm:py-5">
        <p className="ui-eyebrow text-muted-foreground">Event History</p>
        <h2 className="mt-1 text-[1.18rem] font-black tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="px-4 py-4 sm:px-5 sm:py-5">
        {loading ? (
          <div className="rounded-[1.2rem] border border-dashed border-border/70 bg-white/60 px-5 py-10 text-center text-[13px] text-muted-foreground">
            Loading your events...
          </div>
        ) : error ? (
          <div className="rounded-[1.2rem] border border-red-200 bg-red-50 px-5 py-10 text-center text-[13px] text-red-700">
            {error}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            message={emptyMessage}
            ctaHref={emptyCtaHref}
            ctaLabel={emptyCtaLabel}
          />
        ) : (
          <>
            <div className="space-y-3 lg:hidden">
              {rows.map((row) => (
                <MobileEventCard key={row.id} row={row} />
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-[1.2rem] border border-border/60 bg-white/80 lg:block">
              <div className="grid grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-4 border-b border-border/60 bg-secondary/20 px-5 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Event
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Schedule
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Details
                </p>
                <p className="text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Points
                </p>
              </div>

              <div>
                {rows.map((row) => (
                  <DesktopEventRow key={row.id} row={row} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}