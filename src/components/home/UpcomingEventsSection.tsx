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
          <div className="ui-surface-brand rounded-[2.25rem] p-6 sm:p-7 lg:p-8">
            <div className="space-y-2 text-center lg:text-left">
              <p className="ui-title text-[1.4rem] sm:text-[1.5rem]">
                Upcoming Events:
              </p>
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