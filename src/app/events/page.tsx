/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Calendar } from "lucide-react";
import * as React from "react";

import type { Event, EventCategory } from "@/types/events";
import { mockEvents } from "@/data/mockEvents";
import { EventsGrid } from "@/components/events/EventsGrid";

const categoryLabel: Record<EventCategory, string> = {
  VOLUNTEERING: "Volunteering",
  SOCIAL: "Socials",
  PROFESSIONAL_DEVELOPMENT: "Professional Development",
};

export default function EventsPage() {
  const [loading] = React.useState(false);

  const events: Event[] = React.useMemo(() => mockEvents, []);

  const upcoming = React.useMemo(() => {
    const now = Date.now();
    return events
      .filter((e) => new Date(e.startsAt).getTime() >= now)
      .sort(
        (a, b) =>
          new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
      );
  }, [events]);

  const grouped = React.useMemo(() => {
    const groups: Record<EventCategory, Event[]> = {
      VOLUNTEERING: [],
      SOCIAL: [],
      PROFESSIONAL_DEVELOPMENT: [],
    };
    for (const e of upcoming) groups[e.category].push(e);
    return groups;
  }, [upcoming]);

  if (loading) return null;

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 pt-32 pb-12 sm:px-6 sm:pt-36 lg:px-8 space-y-10">
        {/* Header */}
        <header className="space-y-2 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-primary">
            Upcoming Events
          </h1>
          <div className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Explore upcoming UT-Dallas SVA events and opportunities for
            engagement. Earn attendance-based points for participation.
          </div>
        </header>

        {/* Summary */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-xl p-7 shadow-master text-center">
              {/* Very-transparent background image */}
              <div
                className="
                  pointer-events-none
                  absolute inset-0
                  bg-[url('/backgrounds/mil.jpg')]
                  bg-cover
                  bg-center
                  bg-no-repeat
                  opacity-[0.18]
                "
                aria-hidden
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/15">
                  <Calendar size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-black uppercase tracking-widest text-muted-foreground">
                    Total Events Found:
                  </p>
                  <p className="text-3xl font-black tracking-tight text-foreground">
                    {upcoming.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grouped Sections */}
        <div className="space-y-12">
          {(Object.keys(grouped) as EventCategory[]).map((cat) => {
            const list = grouped[cat];

            return (
              <section key={cat} className="space-y-5">
                <div className="space-y-1 text-center">
                  <h2
                    className="
                      text-3xl md:text-4xl
                      font-black tracking-tight
                      text-[var(--accent)]
                    "
                  >
                    {categoryLabel[cat]}:
                  </h2>
                </div>

                <div className="max-w-6xl mx-auto">
                  <EventsGrid events={list} />
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}