// D:\ap_fe\src\components\events\EventsSummaryCard.tsx
"use client";

import * as React from "react";
import { Calendar } from "lucide-react";

type EventsSummaryCardProps = {
  totalEvents: number;
};

function EventsSummaryCardInner({
  totalEvents,
}: EventsSummaryCardProps) {
  return (
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
                {totalEvents}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const EventsSummaryCard = React.memo(EventsSummaryCardInner);