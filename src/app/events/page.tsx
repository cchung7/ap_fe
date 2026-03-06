// D:\ap_fe\src\app\events\page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Calendar } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const headerRef = React.useRef<HTMLElement | null>(null);

  const { scrollYProgress: headerScrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });

  const headerOpacity = useTransform(
    headerScrollYProgress,
    [0, 0.55],
    [1, 0]
  );
  const headerScale = useTransform(
    headerScrollYProgress,
    [0, 0.55],
    [1, 0.96]
  );

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
      <div className="mx-auto w-full max-w-7xl px-4 pt-32 pb-28 sm:px-6 sm:pt-36 lg:px-8 space-y-26">
        {/* Header */}
        <motion.header
          ref={headerRef}
          style={{
            opacity: headerOpacity,
            scale: headerScale,
            willChange: "transform, opacity",
          }}
          className="space-y-4 text-center transform-gpu"
        >
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="
              mx-auto
              w-full
              max-w-none
              ui-title
              leading-[1.05]
              tracking-tight
              text-[#0b2d5b]/80
              [text-shadow:0_4px_12px_rgba(0,0,0,0.22)]
              text-[2.35rem]
              sm:text-5xl
              md:text-[3.2rem]
              lg:text-6xl
            "
          >
            Upcoming Events
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="
              ui-body
              mt-4
              text-muted-foreground
              leading-relaxed
              max-w-xl
              mx-auto
              font-medium
            "
          >
            Explore upcoming UT-Dallas SVA events and opportunities for
            engagement. Earn attendance-based points for participation.
          </motion.div>
        </motion.header>

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
                    Total Events:
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
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                    {categoryLabel[cat]}:
                  </p>
                  <div className="mt-2 mx-auto h-px w-full max-w-xl bg-border/70" />
                </div>

                <div className="max-w-6xl mx-auto">
                  <EventsGrid events={Array.isArray(list) ? list : []} />
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}