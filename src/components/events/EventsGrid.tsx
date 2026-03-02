"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

import type { Event } from "@/types/events";
import { EventCard } from "@/components/events/EventCard";

export function EventsGrid({ events }: { events: Event[] }) {
  return (
    <AnimatePresence mode="popLayout">
      <div
        className={
          // Auto-fit cards into column
          "grid grid-cols-1 gap-6 " +
          "sm:grid-cols-2 " +
          "lg:grid-cols-[repeat(auto-fit,minmax(320px,520px))] " +
          "justify-center"
        }
      >
        {events.length === 0 ? (
          <motion.div
            key="events-empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full rounded-[2.5rem] border-2 border-dashed border-border/40 bg-secondary/5 p-12 text-center"
          >
            <p className="text-sm font-medium text-muted-foreground">
              Events will appear here once they are published by admins.
            </p>
          </motion.div>
        ) : (
          events.map((e) => (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="min-w-0 w-full"
            >
              <EventCard event={e} />
            </motion.div>
          ))
        )}
      </div>
    </AnimatePresence>
  );
}