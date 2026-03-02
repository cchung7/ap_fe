"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, MapPin, Users } from "lucide-react";

import type { Event, EventCategory } from "@/types/events";

const categoryLabel: Record<EventCategory, string> = {
  VOLUNTEERING: "Volunteering",
  SOCIAL: "Socials",
  PROFESSIONAL_DEVELOPMENT: "Professional Development",
};

const categoryBg: Record<EventCategory, string> = {
  VOLUNTEERING: "/backgrounds/volunteer.jpg",
  SOCIAL: "/backgrounds/socials.jpg",
  PROFESSIONAL_DEVELOPMENT: "/backgrounds/pd.jpg",
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

export function EventCard({ event }: { event: Event }) {
  const bg = categoryBg[event.category];

  return (
    <div
      className="
        group
        relative
        rounded-[2.5rem]
        border border-border/40
        bg-card/50
        backdrop-blur-xl
        p-7
        shadow-master
        min-w-0
        overflow-hidden

        /* 3D / depth */
        [perspective:1200px]
        transform-gpu
        transition-all
        duration-300
        ease-out

        /* Hover lift + tilt */
        hover:-translate-y-[4px]
        hover:rotate-x-[1.5deg]
        hover:rotate-y-[-1.5deg]

        /* Hover shadow */
        hover:shadow-hover
      "
    >
      {/* Subtle glow layer */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          rounded-[2.5rem]
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
          bg-[radial-gradient(ellipse_at_top,rgba(177,18,38,0.16),transparent_65%)]
        "
        aria-hidden
      />

      {/* Very-transparent category background image */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-cover
          bg-center
          bg-no-repeat
          opacity-[0.30]
        "
        style={{ backgroundImage: `url('${bg}')` }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 min-w-0">
          <div className="space-y-2 min-w-0">
            <Badge
              variant="outline"
              className={`border ${categoryBadgeClasses(event.category)}`}
            >
              {categoryLabel[event.category]}
            </Badge>

            <h3 className="text-xl font-black tracking-tight text-foreground leading-tight break-words">
              {event.title}
            </h3>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm min-w-0">
          <div className="flex items-start gap-2 text-muted-foreground min-w-0">
            <Calendar size={16} className="mt-0.5 shrink-0" />
            <span className="break-words">{formatDateTime(event.startsAt)}</span>
          </div>

          {event.endsAt && (
            <div className="flex items-start gap-2 text-muted-foreground min-w-0">
              <Clock size={16} className="mt-0.5 shrink-0" />
              <span className="break-words">
                Ends: {formatDateTime(event.endsAt)}
              </span>
            </div>
          )}

          {event.location && (
            <div className="flex items-start gap-2 text-muted-foreground min-w-0">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span className="min-w-0 break-words">{event.location}</span>
            </div>
          )}

          <div className="flex items-start gap-2 text-muted-foreground min-w-0">
            <Users size={16} className="mt-0.5 shrink-0" />
            <span className="break-words">
              {typeof event.capacity === "number"
                ? `Capacity: ${event.capacity}`
                : "Capacity: TBD"}
            </span>
          </div>
        </div>

        {event.description && (
          <p className="mt-4 text-sm text-muted-foreground break-words">
            {event.description}
          </p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap sm:justify-start gap-3 min-w-0">
          <Button
            variant="outline"
            className="rounded-2xl border-border/40 w-full sm:w-auto max-w-full"
            disabled
            title="Registration will be enabled in a later phase."
          >
            Registration
          </Button>

          <Button
            className="rounded-2xl bg-primary text-primary-foreground w-full sm:w-auto max-w-full"
            disabled
            title="Event details view can be added as a modal in Phase 2."
          >
            Details
            <ArrowRight size={16} className="ml-2 shrink-0" />
          </Button>
        </div>
      </div>
    </div>
  );
}