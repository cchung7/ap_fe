"use client";

import * as React from "react";
import { MapPin } from "lucide-react";

export type EventCategory =
  | "VOLUNTEERING"
  | "SOCIAL"
  | "PROFESSIONAL_DEVELOPMENT";

export type UpcomingEvent = {
  id: string;
  title: string;
  category?: EventCategory;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string | null;
};

const categoryBg: Record<EventCategory, string> = {
  VOLUNTEERING: "/backgrounds/volunteer.jpg",
  SOCIAL: "/backgrounds/socials.jpg",
  PROFESSIONAL_DEVELOPMENT: "/backgrounds/pd.jpg",
};

function safeDateLabel(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function safeTimeLabel(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  return d.toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function buildEventDateTimeLabel(event: UpcomingEvent) {
  const baseDate = event.date || event.startTime || event.endTime;
  const dateLabel = safeDateLabel(baseDate);

  const startLabel = safeTimeLabel(event.startTime);
  const endLabel = safeTimeLabel(event.endTime);

  let timeLabel = "";
  if (startLabel && endLabel) {
    timeLabel = `${startLabel} - ${endLabel}`;
  } else if (startLabel) {
    timeLabel = startLabel;
  } else if (endLabel) {
    timeLabel = endLabel;
  }

  if (dateLabel !== "-" && timeLabel) return `${dateLabel} · ${timeLabel}`;
  if (dateLabel !== "-") return dateLabel;
  if (timeLabel) return timeLabel;
  return "-";
}

function getBackgroundImage(category?: EventCategory) {
  if (!category) return "none";
  return `url('${categoryBg[category]}')`;
}

function UpcomingEventCardInner({ event }: { event: UpcomingEvent }) {
  const dateTimeLabel = buildEventDateTimeLabel(event);
  const locationLabel =
    event.location && event.location.trim() ? event.location : "TBD";

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border border-border/50
        bg-background/92
        px-6 py-5
        text-center
        shadow-sm
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-accent/30
        hover:shadow-[0_18px_42px_-24px_rgba(11,18,32,0.14)]
      "
    >
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.42]"
        style={{ backgroundImage: getBackgroundImage(event.category) }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/18 via-card/58 to-card/84"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center">
        <div
          className="text-xl font-black tracking-tight text-foreground"
          title={event.title || "-"}
        >
          {event.title || "-"}
        </div>

        <div className="mt-1 text-sm font-medium text-muted-foreground">
          {dateTimeLabel}
        </div>

        <div className="mt-2 flex justify-center">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-[1px] h-4 w-4 shrink-0 opacity-70" />
            <span title={locationLabel}>{locationLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const UpcomingEventCard = React.memo(UpcomingEventCardInner);