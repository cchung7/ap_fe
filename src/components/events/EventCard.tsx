// D:\ap_fe\src\components\events\EventCard.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";
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

export type EventCardEvent = Event;

type ApiResponse<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
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
      return "border-accent/55 bg-accent/20 !text-accent shadow-[0_0_0_1px_rgba(177,18,38,0.08)]";
    case "SOCIAL":
      return "border-border/60 bg-secondary/95 !text-secondary-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.06)]";
    case "PROFESSIONAL_DEVELOPMENT":
      return "border-primary/50 bg-primary/18 !text-primary shadow-[0_0_0_1px_rgba(29,78,216,0.08)]";
    default:
      return "border-border/60 bg-secondary/95 !text-secondary-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.06)]";
  }
}

function getCapacityText(event: EventCardEvent) {
  if (typeof event.capacity !== "number") return "Capacity: TBD";
  if (typeof event.totalRegistered === "number") {
    return `Capacity: ${event.totalRegistered}/${event.capacity}`;
  }
  return `Capacity: ${event.capacity}`;
}

function EventCardInner({
  event,
  onRegistered,
}: {
  event: EventCardEvent;
  onRegistered?: (eventId: string) => void;
}) {
  const router = useRouter();
  const bg = categoryBg[event.category];

  const isLoggedIn = !!event.viewerAuthenticated;

  const [isRegistered, setIsRegistered] = React.useState(Boolean(event.isRegistered));
  const [isRegistering, setIsRegistering] = React.useState(false);

  React.useEffect(() => {
    setIsRegistered(Boolean(event.isRegistered));
  }, [event.isRegistered]);

  const { showInfo, showError, showSuccess } = useGlobalStatusBanner();

  const handleRegistration = React.useCallback(async () => {
    if (!isLoggedIn) {
      router.push("/signup?next=/events");
      return;
    }

    if (isRegistered || isRegistering) return;

    try {
      setIsRegistering(true);

      const res = await fetch(`/api/events/${event.id}/register`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      const json = (await res.json().catch(() => null)) as ApiResponse | null;

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to register for event");
      }

      setIsRegistered(true);
      onRegistered?.(event.id);
      showSuccess(json?.message || "Event registration successful");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to register for event");
    } finally {
      setIsRegistering(false);
    }
  }, [
    event.id,
    isLoggedIn,
    isRegistered,
    isRegistering,
    onRegistered,
    router,
    showError,
    showSuccess,
  ]);

  const handleCheckIn = React.useCallback(() => {
    if (!isLoggedIn) {
      router.push("/signup?next=/events");
      return;
    }

    showInfo("Event check-in UI will be enabled in the next phase.");
  }, [isLoggedIn, router, showInfo]);

  const registerLabel = isRegistered
    ? "Registered"
    : isRegistering
      ? "Registering..."
      : "Register";

  return (
    <div
      className="
        group
        relative
        min-w-0
        overflow-hidden
        rounded-[2.5rem]
        border border-border/40
        bg-card/60
        p-7
        shadow-master
        backdrop-blur-xl
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:border-border/60
        hover:shadow-hover
      "
    >
      <div
        className="
          pointer-events-none
          absolute inset-0
          rounded-[2.5rem]
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
          bg-[radial-gradient(ellipse_at_top,rgba(177,18,38,0.12),transparent_65%)]
        "
        aria-hidden
      />

      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-cover
          bg-center
          bg-no-repeat
          opacity-[0.72]
          scale-[1.02]
        "
        style={{ backgroundImage: `url('${bg}')` }}
        aria-hidden
      />

      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-gradient-to-b
          from-background/15
          via-card/68
          to-card/90
        "
        aria-hidden
      />

      <div
        className="
          pointer-events-none
          absolute inset-x-6 top-0 h-px
          bg-gradient-to-r from-transparent via-white/40 to-transparent
          opacity-70
        "
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[320px] flex-col">
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0 space-y-5">
            <Badge
              variant="outline"
              className={`ui-eyebrow h-6 rounded-full px-2.5 tracking-[0.14em] backdrop-blur-sm ${categoryBadgeClasses(
                event.category
              )}`}
            >
              {categoryLabel[event.category]}
            </Badge>

            <h3 className="ui-title break-words text-[1.6rem] leading-[1.15]">
              {event.title}
            </h3>
          </div>
        </div>

        <div className="mt-5 min-w-0 space-y-2.5 text-sm">
          <div className="flex min-w-0 items-start gap-2.5 font-medium text-foreground/72">
            <Calendar size={16} className="mt-0.5 shrink-0" />
            <span className="break-words">{formatDateTime(event.startsAt)}</span>
          </div>

          {event.endsAt && (
            <div className="flex min-w-0 items-start gap-2.5 font-medium text-foreground/72">
              <Clock size={16} className="mt-0.5 shrink-0" />
              <span className="break-words">
                Ends: {formatDateTime(event.endsAt)}
              </span>
            </div>
          )}

          {event.location && (
            <div className="flex min-w-0 items-start gap-2.5 font-medium text-foreground/72">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span className="min-w-0 break-words">{event.location}</span>
            </div>
          )}

          <div className="flex min-w-0 items-start gap-2.5 font-medium text-foreground/72">
            <Users size={16} className="mt-0.5 shrink-0" />
            <span className="break-words">{getCapacityText(event)}</span>
          </div>

          {typeof event.pointsValue === "number" && (
            <div className="text-sm font-semibold text-foreground/78">
              Points: {event.pointsValue}
            </div>
          )}
        </div>

        {event.description && (
          <p className="mt-5 break-words text-sm leading-6 text-foreground/78 line-clamp-3">
            {event.description}
          </p>
        )}

        <div className="mt-auto pt-7">
          <div className="flex min-w-0 flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <Button
              className="h-11 w-full max-w-full rounded-2xl bg-accent px-5 text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 disabled:opacity-100 sm:w-auto"
              onClick={() => void handleRegistration()}
              disabled={isRegistered || isRegistering}
              title={
                !isLoggedIn
                  ? "Create an account to register for events."
                  : isRegistered
                    ? "You are already registered for this event."
                    : "Register for this event."
              }
            >
              {registerLabel}
            </Button>

            <Button
              className="h-11 w-full max-w-full rounded-2xl bg-primary px-5 text-primary-foreground sm:w-auto"
              onClick={handleCheckIn}
              disabled={!isLoggedIn}
              title={
                isLoggedIn
                  ? "Event check-in UI will be enabled in the next phase."
                  : "You must be logged in to check in."
              }
            >
              Check-in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const EventCard = React.memo(EventCardInner);