"use client";

import * as React from "react";
import { Award, CalendarCheck2, CheckCircle2, ShieldCheck } from "lucide-react";

import type { AdminMemberRow } from "@/types/admin";
import {
  MemberRoleBadge,
  MemberStatusBadge,
  PersonIdentityCell,
  formatShortDate,
} from "@/components/admin/AdminEntityUI";
import {
  AdminDetailCardShell,
  AdminInfoItem,
  AdminStatTile,
} from "@/components/admin/AdminDetailPrimitives";

type MemberDetailContentProps = {
  member: AdminMemberRow;
};

export function MemberDetailContent({ member }: MemberDetailContentProps) {
  return (
    <div className="min-w-0 space-y-5">
      <section className="grid min-w-0 grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <AdminDetailCardShell
          title="Profile Overview"
          eyebrow="Membership"
          icon={<CheckCircle2 className="h-4 w-4" />}
        >
          <div className="space-y-5">
            <PersonIdentityCell name={member.name} email={member.email} />

            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
              <AdminInfoItem label="Major" value={member.major || "—"} />
              <AdminInfoItem
                label="Academic Year"
                value={member.academicYear || "—"}
              />
              <AdminInfoItem
                label="Joined"
                value={formatShortDate(member.createdAt)}
              />
              <AdminInfoItem
                label="Last Updated"
                value={formatShortDate(member.updatedAt)}
              />
            </div>
          </div>
        </AdminDetailCardShell>

        <div className="grid min-w-0 gap-5">
          <AdminDetailCardShell
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
          </AdminDetailCardShell>

          <AdminDetailCardShell
            title="Points Summary"
            eyebrow="Participation"
            icon={<Award className="h-4 w-4" />}
          >
            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
              <AdminStatTile label="Total Points" value={member.pointsTotal} />
              <AdminStatTile
                label="Events Attended"
                value={member.eventsAttendedCount}
              />
            </div>
          </AdminDetailCardShell>
        </div>
      </section>

      <AdminDetailCardShell
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
      </AdminDetailCardShell>
    </div>
  );
}