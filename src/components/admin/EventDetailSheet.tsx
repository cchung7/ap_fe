"use client";

import * as React from "react";
import {
  Award,
  CalendarDays,
  Clock3,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DetailLabel,
  DetailSection,
  DetailStatCard,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EventStatusBadge, formatShortDate } from "@/components/admin/AdminEntityUI";

type EventCategory =
  | "VOLUNTEERING"
  | "SOCIAL"
  | "PROFESSIONAL_DEVELOPMENT";

export type AdminEventDetail = {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description?: string | null;
  capacity: number;
  totalRegistered: number;
  pointsValue: number;
  checkInCode?: string | null;
  createdAt: string;
  updatedAt: string;
};

type AttendanceStatus = "REGISTERED" | "CHECKED_IN" | "CANCELED";

type EventAttendanceUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  subRole?: string | null;
  academicYear?: string | null;
  major?: string | null;
  pointsTotal?: number;
};

type EventAttendanceItem = {
  id: string;
  status: AttendanceStatus;
  registeredAt?: string;
  checkedInAt?: string | null;
  pointsAwarded?: number;
  user?: EventAttendanceUser | null;
};

type EventAttendancesPayload = {
  event?: {
    id: string;
    title: string;
  };
  summary?: {
    registered: number;
    checkedIn: number;
    canceled: number;
    total: number;
  };
  attendances?: EventAttendanceItem[];
};

type EventAttendancesResponse = {
  success?: boolean;
  message?: string;
  data?: EventAttendancesPayload;
};

type EventDetailSheetProps = {
  event: AdminEventDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (event: AdminEventDetail) => void;
};

function getChicagoDateKey(input: string | Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(input));
}

function isCompletedEvent(dateIso: string) {
  const eventDay = getChicagoDateKey(dateIso);
  const todayDay = getChicagoDateKey(new Date());
  return eventDay < todayDay;
}

function formatEventTimeRange(startTime: string, endTime: string) {
  const formatOne = (value: string) => {
    const [hoursRaw, minutes] = value.split(":");
    const hours = Number(hoursRaw);

    if (Number.isNaN(hours) || !minutes) return value;

    const suffix = hours >= 12 ? "PM" : "AM";
    const normalized = hours % 12 || 12;
    return `${normalized}:${minutes} ${suffix}`;
  };

  return `${formatOne(startTime)} - ${formatOne(endTime)}`;
}

function formatCategory(category: EventCategory) {
  switch (category) {
    case "VOLUNTEERING":
      return "Volunteering";
    case "SOCIAL":
      return "Social";
    case "PROFESSIONAL_DEVELOPMENT":
      return "Professional Dev";
    default:
      return category;
  }
}

function getCheckInCode(event: AdminEventDetail) {
  return event.checkInCode?.trim() ? event.checkInCode : "—";
}

function safeShortDate(value?: string | Date | null) {
  if (!value) return "—";
  return formatShortDate(
    value instanceof Date ? value.toISOString() : value
  );
}

function AttendanceBadge({ status }: { status: AttendanceStatus }) {
  const classes =
    status === "CHECKED_IN"
      ? "border-green-200 bg-green-50 text-green-700"
      : status === "REGISTERED"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-slate-200 bg-slate-50 text-slate-700";

  const label =
    status === "CHECKED_IN"
      ? "Checked In"
      : status === "REGISTERED"
        ? "Registered"
        : "Canceled";

  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${classes}`}
    >
      {label}
    </span>
  );
}

export function EventDetailSheet({
  event,
  open,
  onOpenChange,
  onEdit,
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

  const summary = attendancePayload?.summary ?? {
    registered: 0,
    checkedIn: 0,
    canceled: 0,
    total: 0,
  };

  const attendances = Array.isArray(attendancePayload?.attendances)
    ? attendancePayload.attendances
    : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        {event && (
          <>
            <SheetHeader>
              <SheetTitle>Event Overview</SheetTitle>
              <SheetDescription>
                Review event scheduling, registration, points, and check-in details.
              </SheetDescription>
            </SheetHeader>

            <div className="mt-4 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <DetailSection
                  title="Event Profile"
                  icon={<CalendarDays className="h-4 w-4 text-primary" />}
                >
                  <div className="mb-4">
                    <p className="text-xl font-black tracking-tight text-foreground">
                      {event.title}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {event.description?.trim() || "No description provided."}
                    </p>
                  </div>

                  <div className="grid gap-4 text-sm">
                    <div className="flex items-start gap-3">
                      <CalendarDays className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <DetailLabel>Date</DetailLabel>
                        <p className="mt-1 font-medium text-foreground">
                          {safeShortDate(event.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <DetailLabel>Time</DetailLabel>
                        <p className="mt-1 font-medium text-foreground">
                          {formatEventTimeRange(event.startTime, event.endTime)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <DetailLabel>Location</DetailLabel>
                        <p className="mt-1 font-medium text-foreground">
                          {event.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </DetailSection>

                <div className="space-y-4">
                  <DetailSection
                    title="Event Status"
                    icon={<ShieldCheck className="h-4 w-4 text-primary" />}
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <DetailLabel>Category</DetailLabel>
                        <p className="mt-1 font-medium text-foreground">
                          {formatCategory(event.category)}
                        </p>
                      </div>

                      <div>
                        <DetailLabel>Status</DetailLabel>
                        <div className="mt-1">
                          <EventStatusBadge isCompleted={isCompletedEvent(event.date)} />
                        </div>
                      </div>
                    </div>
                  </DetailSection>

                  <DetailSection
                    title="Registration Summary"
                    icon={<Users className="h-4 w-4 text-primary" />}
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <DetailStatCard label="Capacity" value={event.capacity} />
                      <DetailStatCard label="Registered" value={event.totalRegistered} />
                      <DetailStatCard label="Checked In" value={summary.checkedIn} />
                      <DetailStatCard label="Canceled" value={summary.canceled} />
                    </div>
                  </DetailSection>
                </div>
              </div>

              <DetailSection
                title="Attendee Roster"
                icon={<Users className="h-4 w-4 text-primary" />}
              >
                {loadingAttendances ? (
                  <div className="py-6 text-sm text-muted-foreground">
                    Loading attendee roster...
                  </div>
                ) : attendanceError ? (
                  <div className="py-6 text-sm text-destructive">
                    {attendanceError}
                  </div>
                ) : attendances.length === 0 ? (
                  <div className="py-6 text-sm text-muted-foreground">
                    No attendees have been recorded yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attendances.map((attendance) => (
                      <div
                        key={attendance.id}
                        className="rounded-2xl border border-border/50 bg-background/70 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="font-bold text-foreground">
                              {attendance.user?.name || "Unknown User"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {attendance.user?.email || "No email"}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                              {attendance.user?.subRole ? (
                                <span>{attendance.user.subRole}</span>
                              ) : null}
                              {attendance.user?.academicYear ? (
                                <span>{attendance.user.academicYear}</span>
                              ) : null}
                              {attendance.user?.major ? (
                                <span>{attendance.user.major}</span>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex flex-col items-start gap-2 sm:items-end">
                            <AttendanceBadge status={attendance.status} />
                            <p className="text-xs text-muted-foreground">
                              Registered: {safeShortDate(attendance.registeredAt)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Checked In: {safeShortDate(attendance.checkedInAt)}
                            </p>
                            <p className="text-xs font-semibold text-foreground">
                              Points Awarded: {attendance.pointsAwarded ?? 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </DetailSection>

              <DetailSection
                title="Check-In & Points"
                icon={<Award className="h-4 w-4 text-primary" />}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <DetailLabel>Points Value</DetailLabel>
                    <p className="mt-1 font-medium text-foreground">
                      {event.pointsValue}
                    </p>
                  </div>

                  <div>
                    <DetailLabel>Check-In Code</DetailLabel>
                    <p className="mt-1 font-mono text-sm font-black text-foreground">
                      {getCheckInCode(event)}
                    </p>
                  </div>

                  <div>
                    <DetailLabel>Created</DetailLabel>
                    <p className="mt-1 font-medium text-foreground">
                      {safeShortDate(event.createdAt)}
                    </p>
                  </div>

                  <div>
                    <DetailLabel>Updated</DetailLabel>
                    <p className="mt-1 font-medium text-foreground">
                      {safeShortDate(event.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button type="button" onClick={() => onEdit(event)}>
                    Edit Event
                  </Button>
                </div>
              </DetailSection>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}