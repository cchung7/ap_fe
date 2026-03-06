// D:\ap_fe\src\app\events\page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Event, EventCategory } from "@/types/events";
import { mockEvents } from "@/data/mockEvents";
import { EventsGrid } from "@/components/events/EventsGrid";
import { EventsHeroSection } from "@/components/events/EventsHeroSection";

const categoryLabel: Record<EventCategory, string> = {
  VOLUNTEERING: "Volunteering",
  SOCIAL: "Socials",
  PROFESSIONAL_DEVELOPMENT: "Professional Development",
};

export default function EventsPage() {
  const [loading] = React.useState(false);

  const events: Event[] = React.useMemo(
    () => (Array.isArray(mockEvents) ? mockEvents : []),
    []
  );

  const upcoming = React.useMemo(() => {
    const now = Date.now();
    return events
      .filter((e: any) => {
        const t = new Date(e?.startsAt || "").getTime();
        return Number.isFinite(t) && t >= now;
      })
      .sort(
        (a: any, b: any) =>
          new Date(a?.startsAt || "").getTime() -
          new Date(b?.startsAt || "").getTime()
      );
  }, [events]);

  const grouped = React.useMemo(() => {
    const groups: Record<EventCategory, Event[]> = {
      VOLUNTEERING: [],
      SOCIAL: [],
      PROFESSIONAL_DEVELOPMENT: [],
    };
    for (const e of upcoming as any[]) {
      const cat = (e?.category || "VOLUNTEERING") as EventCategory;
      if (!groups[cat]) continue;
      groups[cat].push(e as any);
    }
    return groups;
  }, [upcoming]);

  if (loading) return null;

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 pt-32 pb-28 sm:px-6 sm:pt-36 lg:px-8 space-y-20">
        <EventsHeroSection totalEvents={upcoming.length} />

        {/* Grouped Sections */}
        <div className="space-y-12">
          {(Object.keys(grouped) as EventCategory[]).map((cat) => {
            const list = grouped[cat];

            return (
              <section key={cat} className="space-y-5">
                <div className="text-center">
                  <h2 className="ui-title text-3xl md:text-4xl lg:text-5xl">
                    {categoryLabel[cat]}:
                  </h2>
                  <div className="mt-2 mx-auto h-px w-full max-w-xl bg-border/70" />
                </div>

                <div className="max-w-6xl mx-auto">
                  <EventsGrid events={Array.isArray(list) ? list : []} />
                </div>
              </section>
            );
          })}
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