"use client";

import * as React from "react";
import {
  Award,
  CalendarDays,
  ShieldCheck,
  Users,
} from "lucide-react";

import { EventStatusBadge, formatShortDate, PersonIdentityCell } from "@/components/admin/AdminEntityUI";
import type {
  AdminEventDetail,
  AttendanceStatus,
  EventAttendancesPayload,
} from "@/app/admin/events/_components/eventsShared";
import {
  formatEventCategory,
  formatEventTimeRange,
  getEventCheckInCode,
  isCompletedEvent,
} from "@/app/admin/events/_components/eventsShared";

type EventDetailContentProps = {
  event: AdminEventDetail;
  attendancePayload: EventAttendancesPayload | null;
  loadingAttendances: boolean;
  attendanceError: string | null;
};

function CardShell({
  title,
  eyebrow,
  icon,
  children,
}: {
  title: string;
  eyebrow?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="relative min-w-0 overflow-hidden rounded-[1.35rem] border-2 border-[rgba(11,45,91,0.18)] bg-white shadow-[0_24px_60px_-28px_rgba(11,18,32,0.26),0_14px_28px_-22px_rgba(11,45,91,0.22)] ring-1 ring-white">
      <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] border border-white/70" />
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,rgba(11,45,91,0.85)_0%,rgba(177,18,38,0.85)_100%)]" />

      <div className="relative border-b border-[rgba(11,45,91,0.12)] bg-[linear-gradient(180deg,rgba(238,243,251,0.92)_0%,rgba(255,255,255,1)_100%)] px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          {icon ? (
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[rgba(11,45,91,0.12)] bg-white text-primary shadow-[0_10px_24px_-16px_rgba(11,18,32,0.22)]">
              {icon}
            </div>
          ) : null}

          <div className="min-w-0">
            {eyebrow ? <p className="ui-eyebrow text-muted-foreground">{eyebrow}</p> : null}
            <h3 className="mt-1 text-[1.05rem] font-black tracking-tight text-foreground">
              {title}
            </h3>
          </div>
        </div>
      </div>

      <div className="relative bg-white px-4 py-4 sm:px-5 sm:py-5">{children}</div>
    </section>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-[1rem] border border-[rgba(11,45,91,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,249,252,0.98)_100%)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_20px_-18px_rgba(11,18,32,0.14)]">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/80">
        {label}
      </p>
      <p className="mt-1 break-words text-[0.96rem] font-medium leading-7 text-foreground">
        {value}
      </p>
    </div>
  );
}

function StatTile({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-[1.15rem] border border-[rgba(11,45,91,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,247,252,0.96)_100%)] px-4 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_12px_24px_-18px_rgba(11,18,32,0.14)]">
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 break-words text-[2rem] font-black leading-none tracking-tight text-foreground">
        {value}
      </p>
    </div>
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

export function EventDetailContent({
  event,
  attendancePayload,
  loadingAttendances,
  attendanceError,
}: EventDetailContentProps) {
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
    <div className="min-w-0 space-y-5">
      <section className="grid min-w-0 grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <CardShell
          title="Event Overview"
          eyebrow="Schedule"
          icon={<CalendarDays className="h-4 w-4" />}
        >
          <div className="space-y-5">
            <div>
              <p className="text-[1.25rem] font-black tracking-tight text-foreground">
                {event.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {event.description?.trim() || "No description provided."}
              </p>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem label="Date" value={formatShortDate(event.date)} />
              <InfoItem
                label="Time"
                value={formatEventTimeRange(event.startTime, event.endTime)}
              />
              <InfoItem label="Location" value={event.location} />
              <InfoItem label="Category" value={formatEventCategory(event.category)} />
            </div>
          </div>
        </CardShell>

        <div className="grid min-w-0 gap-5">
          <CardShell
            title="Event Status"
            eyebrow="Publishing"
            icon={<ShieldCheck className="h-4 w-4" />}
          >
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem
                label="Status"
                value={
                  <span className="inline-flex">
                    <EventStatusBadge isCompleted={isCompletedEvent(event.date)} />
                  </span>
                }
              />
              <InfoItem label="Check-In Code" value={getEventCheckInCode(event)} />
              <InfoItem label="Created" value={formatShortDate(event.createdAt)} />
              <InfoItem label="Updated" value={formatShortDate(event.updatedAt)} />
            </div>
          </CardShell>

          <CardShell
            title="Registration Summary"
            eyebrow="Attendance"
            icon={<Users className="h-4 w-4" />}
          >
            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
              <StatTile label="Capacity" value={event.capacity} />
              <StatTile label="Registered" value={event.totalRegistered} />
              <StatTile label="Checked In" value={summary.checkedIn} />
              <StatTile label="Canceled" value={summary.canceled} />
            </div>
          </CardShell>
        </div>
      </section>

      <CardShell
        title="Attendee Roster"
        eyebrow="Members"
        icon={<Users className="h-4 w-4" />}
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
          <div className="rounded-[1.1rem] border border-dashed border-border/60 bg-background/50 px-4 py-6 text-center text-sm text-muted-foreground">
            No attendees have been recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {attendances.map((attendance) => (
              <div
                key={attendance.id}
                className="min-w-0 rounded-[1.1rem] border border-[rgba(11,45,91,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,249,252,0.96)_100%)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_20px_-18px_rgba(11,18,32,0.12)]"
              >
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <PersonIdentityCell
                      name={attendance.user?.name || "Unknown User"}
                      email={attendance.user?.email || "No email"}
                    />

                    {(attendance.user?.subRole ||
                      attendance.user?.academicYear ||
                      attendance.user?.major) && (
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {attendance.user?.subRole ? <span>{attendance.user.subRole}</span> : null}
                        {attendance.user?.academicYear ? (
                          <span>{attendance.user.academicYear}</span>
                        ) : null}
                        {attendance.user?.major ? <span>{attendance.user.major}</span> : null}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <AttendanceBadge status={attendance.status} />
                    <p className="text-xs text-muted-foreground">
                      Registered: {attendance.registeredAt ? formatShortDate(attendance.registeredAt) : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Checked In: {attendance.checkedInAt ? formatShortDate(attendance.checkedInAt) : "—"}
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
      </CardShell>

      <CardShell
        title="Check-In & Points"
        eyebrow="Operations"
        icon={<Award className="h-4 w-4" />}
      >
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoItem label="Points Value" value={event.pointsValue} />
          <InfoItem label="Check-In Code" value={getEventCheckInCode(event)} />
        </div>
      </CardShell>
    </div>
  );
}