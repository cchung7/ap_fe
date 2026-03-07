// D:\ap_fe\src\app\events\page.tsx
// [Events Main Page]: high-level composition + fetch + loading state

"use client";

import * as React from "react";

import type { Event } from "@/types/events";
import { EventsGrid } from "@/components/events/EventsGrid";
import { EventsHeroSection } from "@/components/events/EventsHeroSection";

type EventsApiItem = Event & {
  isRegistered?: boolean;
  viewerAuthenticated?: boolean;
  currentStatus?: "UPCOMING" | "TODAY" | "PAST";
};

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
        setEvents(Array.isArray(list) ? (list as EventsApiItem[]) : []);
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
      </div>
    </div>
  );
}