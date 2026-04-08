"use client";

import * as React from "react";
import { Award, CalendarCheck2, CheckCircle2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AdminMemberRow } from "@/types/admin";
import {
  MemberQuickStatusButton,
  MemberRoleBadge,
  MemberStatusBadge,
  PersonIdentityCell,
  formatShortDate,
} from "@/components/admin/AdminEntityUI";

type MemberDetailContentProps = {
  member: AdminMemberRow;
  isActing: boolean;
  onApprove: () => void;
  onSetInactive: () => void;
  onReactivate: () => void;
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
            {eyebrow ? (
              <p className="ui-eyebrow text-muted-foreground">{eyebrow}</p>
            ) : null}
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

export function MemberDetailContent({
  member,
  isActing,
  onApprove,
  onSetInactive,
  onReactivate,
}: MemberDetailContentProps) {
  return (
    <div className="min-w-0 space-y-5">
      <section className="grid min-w-0 grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <CardShell
          title="Profile Overview"
          eyebrow="Membership"
          icon={<CheckCircle2 className="h-4 w-4" />}
        >
          <div className="space-y-5">
            <PersonIdentityCell name={member.name} email={member.email} />

            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem label="Major" value={member.major || "—"} />
              <InfoItem label="Academic Year" value={member.academicYear || "—"} />
              <InfoItem label="Joined" value={formatShortDate(member.createdAt)} />
              <InfoItem label="Last Updated" value={formatShortDate(member.updatedAt)} />
            </div>
          </div>
        </CardShell>

        <div className="grid min-w-0 gap-5">
          <CardShell
            title="Access Management"
            eyebrow="Permissions"
            icon={<ShieldCheck className="h-4 w-4" />}
          >
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="min-w-0 rounded-[1rem] border border-[rgba(11,45,91,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,249,252,0.98)_100%)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_20px_-18px_rgba(11,18,32,0.14)]">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/80">
                  Role
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <MemberRoleBadge role={member.role} />
                </div>
              </div>

              <div className="min-w-0 rounded-[1rem] border border-[rgba(11,45,91,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,249,252,0.98)_100%)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_20px_-18px_rgba(11,18,32,0.14)]">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/80">
                  Status
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <MemberStatusBadge status={member.status} />
                </div>
              </div>

              <div className="min-w-0 rounded-[1rem] border border-[rgba(11,45,91,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,249,252,0.98)_100%)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_20px_-18px_rgba(11,18,32,0.14)] sm:col-span-2">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/80">
                  Sub-Role
                </p>
                <p className="mt-2 break-words text-sm font-medium text-foreground">
                  {member.subRole?.trim() || "—"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <MemberQuickStatusButton
                status={member.status}
                loading={isActing}
                onApprove={onApprove}
                onSetInactive={onSetInactive}
                onReactivate={onReactivate}
              />
            </div>
          </CardShell>

          <CardShell
            title="Points Summary"
            eyebrow="Participation"
            icon={<Award className="h-4 w-4" />}
          >
            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
              <StatTile label="Total Points" value={member.pointsTotal} />
              <StatTile label="Events Attended" value={member.eventsAttendedCount} />
            </div>
          </CardShell>
        </div>
      </section>

      <CardShell
        title="Attendance History"
        eyebrow="Records"
        icon={<CalendarCheck2 className="h-4 w-4" />}
      >
        <div className="space-y-2">
          {member.attendancePreview.length > 0 ? (
            member.attendancePreview.map((entry) => (
              <div
                key={`${member.id}-${entry.eventId}`}
                className="min-w-0 rounded-[1.1rem] border border-[rgba(11,45,91,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,249,252,0.96)_100%)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_20px_-18px_rgba(11,18,32,0.12)]"
              >
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="break-words font-semibold text-foreground">
                      {entry.title}
                    </p>
                    <p className="mt-1 break-words text-[12px] text-muted-foreground">
                      {entry.dateLabel} · {entry.statusLabel}
                    </p>
                  </div>

                  <p className="shrink-0 text-[12px] font-black text-foreground">
                    +{entry.pointsAwarded}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.1rem] border border-dashed border-border/60 bg-background/50 px-4 py-6 text-center text-sm text-muted-foreground">
              No attendance records available yet.
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            size="sm"
            className="min-w-[170px] rounded-2xl bg-primary px-4 text-primary-foreground shadow-[0_16px_34px_-18px_rgba(11,45,91,0.35)] hover:bg-primary/92"
          >
            Manage Attendance
          </Button>

          <Button
            type="button"
            size="sm"
            className="min-w-[150px] rounded-2xl border border-green-300 bg-green-600 text-white shadow-[0_16px_34px_-18px_rgba(22,101,52,0.35)] hover:border-green-700 hover:bg-green-700"
          >
            Adjust Points
          </Button>
        </div>
      </CardShell>
    </div>
  );
}