"use client";

import * as React from "react";

import {
  UpcomingEventCard,
  type UpcomingEvent,
} from "@/components/upcomingEvents/UpcomingEventCard";

type UpcomingEventGridProps = {
  events: UpcomingEvent[];
};

function UpcomingEventGridInner({ events }: UpcomingEventGridProps) {
  const gridClassName = React.useMemo(() => {
    if (events.length === 1) {
      return "mx-auto grid max-w-[34rem] grid-cols-1 gap-4";
    }

    if (events.length === 2) {
      return "mx-auto grid max-w-[72rem] grid-cols-1 gap-4 xl:grid-cols-2";
    }

    return "grid grid-cols-1 gap-4 md:mx-auto md:max-w-[38rem] xl:max-w-[90rem] xl:grid-cols-3";
  }, [events.length]);

  return (
    <div className={gridClassName}>
      {events.map((event) => (
        <UpcomingEventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export const UpcomingEventGrid = React.memo(UpcomingEventGridInner);