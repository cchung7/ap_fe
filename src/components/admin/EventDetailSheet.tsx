"use client";

import * as React from "react";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventDetailContent } from "@/components/admin/EventDetailContent";
import type {
  AdminEventDetail as EventDetailData,
  EventAttendancesPayload,
  EventAttendancesResponse,
} from "@/app/admin/events/_components/eventsShared";

export type AdminEventDetail = EventDetailData;

type EventDetailSheetProps = {
  event: AdminEventDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EventDetailSheet({
  event,
  open,
  onOpenChange,
}: EventDetailSheetProps) {
  const [attendancePayload, setAttendancePayload] =
    React.useState<EventAttendancesPayload | null>(null);
  const [loadingAttendances, setLoadingAttendances] = React.useState(false);
  const [attendanceError, setAttendanceError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;

    async function loadAttendances(eventId: string) {
      try {
        setLoadingAttendances(true);
        setAttendanceError(null);

        const res = await fetch(`/api/admin/events/${eventId}/attendances`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const json = (await res.json().catch(() => null)) as EventAttendancesResponse | null;

        if (!res.ok || !json?.success) {
          throw new Error(json?.message || "Failed to fetch event attendees");
        }

        if (!alive) return;
        setAttendancePayload(json.data ?? null);
      } catch (err) {
        if (!alive) return;
        setAttendancePayload(null);
        setAttendanceError(
          err instanceof Error ? err.message : "Failed to fetch event attendees"
        );
      } finally {
        if (!alive) return;
        setLoadingAttendances(false);
      }
    }

    if (open && event?.id) {
      void loadAttendances(event.id);
    } else {
      setAttendancePayload(null);
      setAttendanceError(null);
    }

    return () => {
      alive = false;
    };
  }, [open, event?.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={[
          "w-[min(68rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)] p-0 overflow-hidden",
          "sm:w-[min(68rem,calc(100vw-2rem))] sm:max-w-[calc(100vw-2rem)]",
          "rounded-[1.75rem] border-2 border-[rgba(11,45,91,0.28)] bg-white",
          "shadow-[0_32px_90px_-24px_rgba(11,18,32,0.42),0_18px_36px_-22px_rgba(11,45,91,0.30)]",
          "ring-1 ring-white",
        ].join(" ")}
      >
        {event && (
          <div className="relative flex max-h-[calc(100vh-1rem)] min-h-0 flex-col overflow-hidden rounded-[1.75rem] bg-white sm:max-h-[calc(100vh-2rem)]">
            <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] border border-white/70" />

            <DialogHeader className="relative shrink-0 overflow-hidden border-b border-[rgba(11,45,91,0.14)] bg-[linear-gradient(180deg,rgba(238,243,251,0.92)_0%,rgba(255,255,255,1)_100%)] px-4 py-4 pr-14 sm:px-5 sm:py-5 lg:px-6">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,rgba(11,45,91,0.85)_0%,rgba(177,18,38,0.85)_100%)]" />

              <div className="space-y-1.5">
                <p className="ui-eyebrow text-muted-foreground">Event Record</p>
                <DialogTitle className="text-[1.35rem] font-black tracking-tight text-foreground sm:text-[1.55rem]">
                  Event Overview
                </DialogTitle>
                <DialogDescription className="max-w-2xl text-[13px] leading-6 text-muted-foreground">
                  Review scheduling, registration, attendance, points, and check-in details.
                </DialogDescription>
              </div>
            </DialogHeader>

            <DialogBody className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
              <EventDetailContent
                event={event}
                attendancePayload={attendancePayload}
                loadingAttendances={loadingAttendances}
                attendanceError={attendanceError}
              />
            </DialogBody>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}