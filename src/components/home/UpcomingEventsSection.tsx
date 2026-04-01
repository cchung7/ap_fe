// D:\ap_fe\src\components\home\UpcomingEventsSection.tsx
"use client";

import * as React from "react";

import { UpcomingEventGrid } from "@/components/upcomingEvents/UpcomingEventGrid";
import type { UpcomingEvent } from "@/components/upcomingEvents/UpcomingEventCard";

function EmptyState() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/80 px-6 py-7 text-center shadow-sm">
      <p className="text-base font-semibold text-foreground/72">
        No upcoming events available.
      </p>
      <p className="mt-1 text-sm text-muted-foreground/90">
        Please check back soon for future events and updates.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-border/40 bg-background/90 p-10 text-center text-sm text-muted-foreground">
      Loading events…
    </div>
  );
}

export function UpcomingEventsSection() {
  const [upcomingEvents, setUpcomingEvents] = React.useState<UpcomingEvent[]>(
    []
  );
  const [loadingEvents, setLoadingEvents] = React.useState(true);

  React.useEffect(() => {
    let alive = true;

    async function runEvents() {
      try {
        setLoadingEvents(true);

        const res = await fetch("/api/events/upcoming?limit=3", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const json = await res.json().catch(() => ({}));
        const list = (json as any)?.data ?? (json as any)?.events ?? [];

        if (!alive) return;
        setUpcomingEvents(Array.isArray(list) ? list.slice(0, 3) : []);
      } catch {
        if (!alive) return;
        setUpcomingEvents([]);
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
    <section className="ui-home-section">
      <div className="ui-page-shell">
        <div className="ui-right-module">
          <div className="rounded-[2.25rem] p-6 sm:p-7 lg:p-6">
            <div className="flex justify-center lg:justify-start lg:pl-2 xl:pl-4">
              <div className="ui-section-copy w-full max-w-2xl text-center lg:max-w-[28rem] lg:text-left">
                <p className="ui-eyebrow text-muted-foreground">
                  Event Calendar
                </p>

                <h2 className="ui-title mx-auto max-w-[9ch] text-[2.35rem] leading-[1.05] sm:text-[2.55rem] md:text-[2.85rem] lg:mx-0 lg:max-w-[9ch] lg:text-[3rem] xl:text-[3.2rem]">
                  Upcoming Events
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {loadingEvents ? (
                <LoadingState />
              ) : upcomingEvents.length === 0 ? (
                <EmptyState />
              ) : (
                <UpcomingEventGrid events={upcomingEvents} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}