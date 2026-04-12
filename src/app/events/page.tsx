"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Event, AttendanceStatus } from "@/types/events";
import { EventsGrid } from "@/components/events/EventsGrid";
import { EventsHeroSection } from "@/components/events/EventsHeroSection";
import { useMe } from "@/hooks/useMe";

function toLocalDateTimeString(dateValue: unknown, timeValue?: unknown) {
  if (!dateValue) return "";

  const raw =
    typeof dateValue === "string"
      ? dateValue
      : dateValue instanceof Date
        ? dateValue.toISOString()
        : String(dateValue);

  const dateMatch = raw.match(/^\d{4}-\d{2}-\d{2}/);
  if (!dateMatch) return "";

  const datePart = dateMatch[0];

  if (!timeValue) {
    return `${datePart}T00:00:00`;
  }

  const t = String(timeValue);
  const timeMatch = /^(\d{1,2}):(\d{2})$/.exec(t);
  if (!timeMatch) {
    return `${datePart}T00:00:00`;
  }

  const hh = timeMatch[1].padStart(2, "0");
  const mm = timeMatch[2];

  return `${datePart}T${hh}:${mm}:00`;
}

function normalizeEvent(raw: any): Event | null {
  if (!raw) return null;

  const id = String(raw.id || raw._id || "");
  const title = String(raw.title || "").trim();
  const category = raw.category as Event["category"];

  if (!id || !title || !category) return null;

  const startsAt =
    raw.date && raw.startTime
      ? toLocalDateTimeString(raw.date, raw.startTime)
      : typeof raw.startsAt === "string" && raw.startsAt
        ? raw.startsAt
        : "";

  const endsAt =
    raw.date && raw.endTime
      ? toLocalDateTimeString(raw.date, raw.endTime)
      : typeof raw.endsAt === "string" && raw.endsAt
        ? raw.endsAt
        : undefined;

  if (!startsAt) return null;

  const attendanceStatus =
    raw.attendanceStatus ?? (raw.isRegistered ? "REGISTERED" : undefined);

  return {
    id,
    title,
    description: raw.description ?? undefined,
    category,
    startsAt,
    endsAt,
    location: raw.location ?? undefined,
    capacity:
      typeof raw.capacity === "number"
        ? raw.capacity
        : raw.capacity != null
          ? Number(raw.capacity)
          : undefined,
    totalRegistered:
      typeof raw.totalRegistered === "number"
        ? raw.totalRegistered
        : raw.totalRegistered != null
          ? Number(raw.totalRegistered)
          : undefined,
    pointsValue:
      typeof raw.pointsValue === "number"
        ? raw.pointsValue
        : raw.pointsValue != null
          ? Number(raw.pointsValue)
          : undefined,
    createdAt: raw.createdAt ?? undefined,
    updatedAt: raw.updatedAt ?? undefined,
    isRegistered: Boolean(raw.isRegistered),
    viewerAuthenticated: Boolean(raw.viewerAuthenticated),
    currentStatus: raw.currentStatus,
    attendanceStatus,
    checkedInAt: raw.checkedInAt ?? undefined,
    pointsAwarded:
      typeof raw.pointsAwarded === "number"
        ? raw.pointsAwarded
        : raw.pointsAwarded != null
          ? Number(raw.pointsAwarded)
          : undefined,
  };
}

export default function EventsPage() {
  const { loading: authLoading, isPendingMember } = useMe();

  const [events, setEvents] = React.useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = React.useState(true);

  React.useEffect(() => {
    let alive = true;

    async function runEvents() {
      try {
        setLoadingEvents(true);

        const res = await fetch("/api/events?status=UPCOMING&page=1&limit=100", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const json = await res.json().catch(() => ({}));
        const list = (json as { data?: unknown[] })?.data ?? [];

        if (!alive) return;

        const normalized = Array.isArray(list)
          ? ((list as any[]).map(normalizeEvent).filter(Boolean) as Event[])
          : [];

        setEvents(normalized);
      } catch {
        if (!alive) return;
        setEvents([]);
      } finally {
        if (!alive) return;
        setLoadingEvents(false);
      }
    }

    void runEvents();

    return () => {
      alive = false;
    };
  }, []);

  const handleRegistered = React.useCallback((eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event;

        return {
          ...event,
          isRegistered: true,
          attendanceStatus:
            event.attendanceStatus === "CHECKED_IN"
              ? "CHECKED_IN"
              : "REGISTERED",
          totalRegistered:
            typeof event.totalRegistered === "number"
              ? event.totalRegistered + 1
              : event.totalRegistered,
        };
      })
    );
  }, []);

  const handleCheckedIn = React.useCallback(
    (
      eventId: string,
      payload?: {
        status?: AttendanceStatus;
        checkedInAt?: string;
        pointsAwarded?: number;
      }
    ) => {
      setEvents((prev) =>
        prev.map((event) => {
          if (event.id !== eventId) return event;

          return {
            ...event,
            isRegistered: true,
            attendanceStatus: payload?.status ?? "CHECKED_IN",
            checkedInAt: payload?.checkedInAt ?? event.checkedInAt,
            pointsAwarded:
              typeof payload?.pointsAwarded === "number"
                ? payload.pointsAwarded
                : event.pointsAwarded,
          };
        })
      );
    },
    []
  );

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 pt-32 pb-28 md:pb-36 sm:px-6 sm:pt-36 lg:px-8 space-y-20">
        <EventsHeroSection totalEvents={loadingEvents ? 0 : events.length} />

        {!authLoading && isPendingMember ? (
          <div className="mx-auto w-full max-w-4xl rounded-[1.6rem] border border-amber-300/60 bg-amber-50/85 px-5 py-4 text-sm text-amber-900 shadow-[0_14px_34px_-24px_rgba(146,64,14,0.32)] backdrop-blur">
            You are signed in, but your account is still pending approval. You can
            browse upcoming events now, but registration and check-in will remain
            unavailable until an administrator approves your account.
          </div>
        ) : null}

        <div className="max-w-6xl mx-auto w-full">
          <EventsGrid
            events={events}
            loading={loadingEvents}
            onRegistered={handleRegistered}
            onCheckedIn={handleCheckedIn}
          />
        </div>

        <div className="pt-4 text-center">
          <Button
            asChild
            size="lg"
            className="rounded-full px-7 text-base font-semibold tracking-wide shadow-none transition-all hover:-translate-y-0.5 hover:bg-accent"
          >
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}