// D:\ap_fe\src\app\events\page.tsx
// [Events Main Page]: high-level composition + fetch + loading state

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Event } from "@/types/events";
import { EventsGrid } from "@/components/events/EventsGrid";
import { EventsHeroSection } from "@/components/events/EventsHeroSection";

type EventsApiItem = Event & {
  isRegistered?: boolean;
  viewerAuthenticated?: boolean;
  currentStatus?: "UPCOMING" | "TODAY" | "PAST";
};

function toIsoFromDateAndTime(dateValue: unknown, timeValue?: unknown) {
  if (!dateValue) return "";

  // dateValue can be ISO string, Date string, or Date-like
  const base = new Date(dateValue as any);
  if (!Number.isFinite(base.getTime())) return "";

  if (!timeValue) return base.toISOString();

  const t = String(timeValue);
  const match = /^(\d{1,2}):(\d{2})$/.exec(t);
  if (!match) return base.toISOString();

  const hh = Number(match[1]);
  const mm = Number(match[2]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return base.toISOString();

  const local = new Date(base);
  local.setHours(hh, mm, 0, 0);
  return local.toISOString();
}

function normalizeEvent(raw: any): EventsApiItem | null {
  if (!raw) return null;

  const id = String(raw.id || raw._id || "");
  const title = String(raw.title || "").trim();
  const category = raw.category as EventsApiItem["category"];

  if (!id || !title || !category) return null;

  // Prefer backend-provided startsAt/endsAt if present; otherwise derive from date/startTime/endTime.
  const startsAt =
    typeof raw.startsAt === "string" && raw.startsAt
      ? raw.startsAt
      : toIsoFromDateAndTime(raw.date, raw.startTime);

  const endsAt =
    typeof raw.endsAt === "string" && raw.endsAt
      ? raw.endsAt
      : raw.endTime
      ? toIsoFromDateAndTime(raw.date, raw.endTime)
      : undefined;

  if (!startsAt) return null;

  return {
    id,
    title,
    description: raw.description ?? undefined,
    category,
    startsAt,
    endsAt,
    location: raw.location ?? undefined,
    capacity:
      typeof raw.capacity === "number"
        ? raw.capacity
        : raw.capacity != null
        ? Number(raw.capacity)
        : undefined,

    createdAt: raw.createdAt ?? undefined,
    updatedAt: raw.updatedAt ?? undefined,

    isRegistered: Boolean(raw.isRegistered),
    viewerAuthenticated: Boolean(raw.viewerAuthenticated),
    currentStatus: raw.currentStatus,
  };
}

export default function EventsPage() {
  const [events, setEvents] = React.useState<EventsApiItem[]>([]);
  const [loadingEvents, setLoadingEvents] = React.useState(true);

  React.useEffect(() => {
    let alive = true;

    async function runEvents() {
      try {
        setLoadingEvents(true);

        const res = await fetch("/api/events?status=UPCOMING&page=1&limit=100", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const json = await res.json().catch(() => ({}));
        const list = (json as { data?: unknown[] })?.data ?? [];

        if (!alive) return;

        const normalized = Array.isArray(list)
          ? (list as any[])
              .map(normalizeEvent)
              .filter(Boolean) as EventsApiItem[]
          : [];

        setEvents(normalized);
      } catch {
        if (!alive) return;
        setEvents([]);
      } finally {
        if (!alive) return;
        setLoadingEvents(false);
      }
    }

    void runEvents();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 pt-32 pb-28 md:pb-36 sm:px-6 sm:pt-36 lg:px-8 space-y-20">
        <EventsHeroSection totalEvents={loadingEvents ? 0 : events.length} />

        <div className="max-w-6xl mx-auto w-full">
          <EventsGrid events={events} loading={loadingEvents} />
        </div>

        {/* Back to Home */}
        <div className="pt-4 text-center">
          <Button
            asChild
            size="lg"
            className="rounded-full px-7 text-base font-semibold tracking-wide shadow-none transition-all hover:-translate-y-0.5 hover:bg-accent"
          >
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}