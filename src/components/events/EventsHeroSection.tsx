// D:\ap_fe\src\components\events\EventsHeroSection.tsx
"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { EventsSummaryCard } from "@/components/events/EventsSummaryCard";

type EventsHeroSectionProps = {
  totalEvents: number;
};

export function EventsHeroSection({
  totalEvents,
}: EventsHeroSectionProps) {
  const topSectionRef = React.useRef<HTMLElement | null>(null);

  const { scrollYProgress: topSectionScrollYProgress } = useScroll({
    target: topSectionRef,
    offset: ["start start", "end start"],
  });

  const topSectionOpacity = useTransform(
    topSectionScrollYProgress,
    [0, 0.55],
    [1, 0]
  );
  const topSectionScale = useTransform(
    topSectionScrollYProgress,
    [0, 0.55],
    [1, 0.96]
  );

  return (
    <motion.section
      ref={topSectionRef}
      style={{
        opacity: topSectionOpacity,
        scale: topSectionScale,
        willChange: "transform, opacity",
      }}
      className="space-y-6 transform-gpu"
    >
      <motion.header className="space-y-4 text-center">
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
          engagement.
        </motion.div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.12 }}
      >
        <EventsSummaryCard totalEvents={totalEvents} />
      </motion.div>
    </motion.section>
  );
}