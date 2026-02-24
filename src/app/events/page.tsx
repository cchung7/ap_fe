/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Users,
  ArrowRight,
} from "lucide-react";
import * as React from "react";

import type { Event, EventCategory } from "@/types/events";
import { mockEvents } from "@/data/mockEvents";

const categoryLabel: Record<EventCategory, string> = {
  VOLUNTEERING: "Volunteering",
  SOCIAL: "Social",
  PROFESSIONAL_DEVELOPMENT: "Professional Development",
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function categoryBadgeClasses(category: EventCategory) {
  switch (category) {
    case "VOLUNTEERING":
      return "bg-secondary text-secondary-foreground border-border/40";
    case "SOCIAL":
      return "bg-accent/10 text-accent border-accent/20";
    case "PROFESSIONAL_DEVELOPMENT":
      return "bg-primary/10 text-primary border-primary/20";
    default:
      return "bg-secondary text-secondary-foreground border-border/40";
  }
}

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

  return (
    <div className="min-h-screen bg-background pt-32 pb-12 px-6">
      <div className="container max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary">
            All Events
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            View upcoming events across volunteering, social activities, and
            professional development. Registration and attendance-based points
            will be added later.
          </p>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-xl p-7 shadow-master">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/15">
                <Calendar size={18} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Upcoming Events
                </p>
                <p className="text-2xl font-black tracking-tight text-foreground">
                  {upcoming.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-xl p-7 shadow-master">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center border border-border/40">
                <Tag size={18} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Points
                </p>
                <p className="text-sm font-semibold text-foreground">
                  Attendance-based ranking planned
                </p>
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
                <div className="flex items-end justify-between gap-6">
                  <div className="space-y-1">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary">
                      {categoryLabel[cat]}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {list.length > 0
                        ? `${list.length} upcoming event${
                            list.length === 1 ? "" : "s"
                          }`
                        : "No upcoming events in this category yet."}
                    </p>
                  </div>
                </div>

                <AnimatePresence mode="popLayout">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {list.length === 0 ? (
                      <motion.div
                        key={`${cat}-empty`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="lg:col-span-3 rounded-[2.5rem] border-2 border-dashed border-border/40 bg-secondary/5 p-12 text-center"
                      >
                        <p className="text-sm font-medium text-muted-foreground">
                          Events will appear here once they are published by
                          admins.
                        </p>
                      </motion.div>
                    ) : (
                      list.map((e) => (
                        <motion.div
                          key={e.id}
                          layout
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          className="rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-xl p-7 shadow-master hover:shadow-hover transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                              <Badge
                                variant="outline"
                                className={`border ${categoryBadgeClasses(
                                  e.category
                                )}`}
                              >
                                {categoryLabel[e.category]}
                              </Badge>
                              <h3 className="text-xl font-black tracking-tight text-foreground">
                                {e.title}
                              </h3>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar size={16} />
                              <span>{formatDateTime(e.startsAt)}</span>
                            </div>

                            {e.endsAt && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock size={16} />
                                <span>Ends: {formatDateTime(e.endsAt)}</span>
                              </div>
                            )}

                            {e.location && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin size={16} />
                                <span>{e.location}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users size={16} />
                              <span>
                                {typeof e.capacity === "number"
                                  ? `Capacity: ${e.capacity}`
                                  : "Capacity: TBD"}
                              </span>
                            </div>
                          </div>

                          {e.description && (
                            <p className="mt-4 text-sm text-muted-foreground">
                              {e.description}
                            </p>
                          )}

                          <div className="mt-6 flex items-center justify-between gap-3">
                            <Button
                              variant="outline"
                              className="rounded-2xl border-border/40"
                              disabled
                              title="Registration will be enabled in a later phase."
                            >
                              Registration (Coming Soon)
                            </Button>

                            <Button
                              className="rounded-2xl bg-primary text-primary-foreground"
                              disabled
                              title="Event details view can be added as a modal in Phase 2."
                            >
                              Details
                              <ArrowRight size={16} className="ml-2" />
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </AnimatePresence>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}