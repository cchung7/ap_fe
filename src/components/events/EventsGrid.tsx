// D:\ap_fe\src\components\events\EventsGrid.tsx
// Page layout (e.g. Grouping + section rendering + empty/loading state)

"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { EventCategory } from "@/types/events";
import { EventCard, type EventCardEvent } from "@/components/events/EventCard";

const categoryLabel: Record<EventCategory, string> = {
  VOLUNTEERING: "Volunteering",
  SOCIAL: "Socials",
  PROFESSIONAL_DEVELOPMENT: "Professional Development",
};

type EventsGridProps = {
  events: EventCardEvent[];
  loading?: boolean;
};

function Section({
  title,
  events,
}: {
  title: string;
  events: EventCardEvent[];
}) {
  if (events.length === 0) return null;

  const isSingleCard = events.length === 1;

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="ui-title text-3xl md:text-4xl lg:text-5xl">{title}:</h2>
        <div className="mt-2 mx-auto h-px w-full max-w-xl bg-border/70" />
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          <AnimatePresence mode="popLayout">
            {isSingleCard ? (
              <div className="flex justify-center">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="min-w-0 w-full max-w-[520px]"
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div
                className={
                  "grid grid-cols-1 gap-6 justify-items-center " +
                  "sm:grid-cols-2 " +
                  "lg:grid-cols-[repeat(auto-fit,minmax(320px,520px))] " +
                  "justify-center"
                }
              >
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="min-w-0 w-full max-w-[520px]"
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export function EventsGrid({ events, loading = false }: EventsGridProps) {
  const normalizedEvents = React.useMemo(
    () => (Array.isArray(events) ? events : []),
    [events]
  );

  const sorted = React.useMemo(() => {
    return [...normalizedEvents].sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    );
  }, [normalizedEvents]);

  const grouped = React.useMemo(() => {
    const groups: Record<EventCategory, EventCardEvent[]> = {
      VOLUNTEERING: [],
      SOCIAL: [],
      PROFESSIONAL_DEVELOPMENT: [],
    };

    for (const event of sorted) {
      const category = event.category;
      if (!groups[category]) continue;
      groups[category].push(event);
    }

    return groups;
  }, [sorted]);

  if (loading) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border/40 bg-secondary/5 p-10 text-center text-sm text-muted-foreground">
        Loading events…
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="rounded-[2.5rem] border-2 border-dashed border-border/40 bg-secondary/5 p-12 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Events will appear here once they are published.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-16">
      <Section title={categoryLabel.VOLUNTEERING} events={grouped.VOLUNTEERING} />
      <Section title={categoryLabel.SOCIAL} events={grouped.SOCIAL} />
      <Section
        title={categoryLabel.PROFESSIONAL_DEVELOPMENT}
        events={grouped.PROFESSIONAL_DEVELOPMENT}
      />
    </div>
  );
}
