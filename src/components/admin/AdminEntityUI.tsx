"use client";

import * as React from "react";
import {
  CalendarCheck2,
  CheckCircle2,
  Eye,
  Loader2,
  PauseCircle,
  Pencil,
  RotateCcw,
  Trash2,
  ShieldCheck,
  Award,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminMemberRow } from "@/types/admin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import {
  DetailLabel,
  DetailSection,
  DetailStatCard,
} from "@/components/ui/sheet";

export function formatShortDate(value?: string | Date | null) {
  const date = new Date(value || "");
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.trim()[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PersonIdentityCell({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-black text-primary">
        {getInitials(name)}
      </div>

      <div className="min-w-0">
        <p className="truncate font-bold text-foreground">{name}</p>
        <p className="truncate text-[12px] text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}

export function StackedInfoCell({
  primary,
  secondary,
}: {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="font-medium text-foreground">{primary}</p>
      <p className="text-[12px] text-muted-foreground">{secondary || "—"}</p>
    </div>
  );
}

export function LabeledBadgeStack({
  badge,
  secondary,
}: {
  badge: React.ReactNode;
  secondary?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      {badge}
      <p className="text-[12px] text-muted-foreground">{secondary || "—"}</p>
    </div>
  );
}

export function MemberStatusBadge({
  status,
}: {
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
}) {
  const classes =
    status === "ACTIVE"
      ? "border-green-200 bg-green-100 text-green-800"
      : status === "PENDING"
        ? "border-amber-200 bg-amber-100 text-amber-800"
        : "border-rose-200 bg-rose-100 text-rose-800";

  return (
    <Badge
      variant="outline"
      className={classes}
    >
      {formatMemberStatusLabel(status)}
    </Badge>
  );
}

export function getMemberStatusBadgeVariant(
  _status: "ACTIVE" | "PENDING" | "SUSPENDED"
): "default" | "secondary" | "destructive" | "outline" {
  return "outline";
}

export function MemberRoleBadge({
  role,
}: {
  role: "ADMIN" | "MEMBER";
}) {
  return <Badge variant={getMemberRoleBadgeVariant(role)}>{formatMemberRole(role)}</Badge>;
}

export function EventStatusBadge({
  isCompleted,
}: {
  isCompleted: boolean;
}) {
  const classes = isCompleted
    ? "border-green-200 bg-green-100 text-green-600"
    : "border-orange-200 bg-orange-100 text-orange-600";

  return (
    <Badge variant="outline" className={classes}>
      {isCompleted ? "Completed" : "Upcoming"}
    </Badge>
  );
}

export function formatMemberStatusLabel(status: "ACTIVE" | "PENDING" | "SUSPENDED") {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "PENDING":
      return "Pending";
    case "SUSPENDED":
      return "Inactive";
    default:
      return status;
  }
}

export function getMemberRoleBadgeVariant(
  role: "ADMIN" | "MEMBER"
): "default" | "secondary" | "outline" {
  return role === "ADMIN" ? "default" : "outline";
}

export function formatMemberRole(role: "ADMIN" | "MEMBER") {
  return role === "ADMIN" ? "Admin" : "Member";
}

export function RowActionButton({
  icon,
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button> & {
  icon?: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      size="sm"
      className={cn(
        "h-8 rounded-xl px-2.75 text-[9px] font-black uppercase tracking-[0.15em] shadow-none",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </Button>
  );
}

export function ViewButton(
  props: Omit<React.ComponentProps<typeof RowActionButton>, "variant" | "icon">
) {
  return (
    <RowActionButton
      variant="outline"
      className="border-border/70 bg-white hover:border-accent/35 hover:bg-white"
      icon={<Eye className="h-3 w-3" />}
      {...props}
    >
      View
    </RowActionButton>
  );
}

export function EditButton(
  props: Omit<React.ComponentProps<typeof RowActionButton>, "variant" | "icon">
) {
  return (
    <RowActionButton
      variant="outline"
      className="border-border/70 bg-white hover:border-accent/35 hover:bg-white"
      icon={<Pencil className="h-3 w-3" />}
      {...props}
    >
      Edit
    </RowActionButton>
  );
}

export function DeleteButton({
  loading,
  children = "Delete",
  ...props
}: Omit<React.ComponentProps<typeof RowActionButton>, "variant" | "icon"> & {
  loading?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <RowActionButton
      variant="logout"
      icon={
        loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />
      }
      {...props}
    >
      {loading ? "Deleting..." : children}
    </RowActionButton>
  );
}

export function MemberQuickStatusButton({
  status,
  loading,
  onApprove,
  onSetInactive,
  onReactivate,
}: {
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  loading?: boolean;
  onApprove: () => void;
  onSetInactive: () => void;
  onReactivate: () => void;
}) {
  if (status === "PENDING") {
    return (
      <Button
        type="button"
        size="sm"
        disabled={loading}
        onClick={onApprove}
        className="min-w-[170px] rounded-2xl border border-green-300 bg-green-600 px-4 text-sm font-semibold text-white shadow-[0_16px_34px_-18px_rgba(22,101,52,0.35)] hover:border-green-700 hover:bg-green-700"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        Set as Active
      </Button>
    );
  }

  if (status === "ACTIVE") {
    return (
      <Button
        type="button"
        size="sm"
        disabled={loading}
        onClick={onSetInactive}
        className="min-w-[170px] rounded-2xl border border-orange-300 bg-orange-500 px-4 text-sm font-semibold text-white shadow-[0_16px_34px_-18px_rgba(194,65,12,0.35)] hover:border-orange-600 hover:bg-orange-600"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <PauseCircle className="h-4 w-4" />
        )}
        Set as Inactive
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="sm"
      disabled={loading}
      onClick={onReactivate}
      className="min-w-[170px] rounded-2xl border border-green-300 bg-green-600 px-4 text-sm font-semibold text-white shadow-[0_16px_34px_-18px_rgba(22,101,52,0.35)] hover:border-green-700 hover:bg-green-700"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RotateCcw className="h-4 w-4" />
      )}
      Reactivate
    </Button>
  );
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  primaryText,
  secondaryText,
  loading,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  primaryText: React.ReactNode;
  secondaryText?: React.ReactNode;
  loading?: boolean;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0">
        <div className="flex max-h-[calc(100vh-2rem)] min-h-0 flex-col bg-white">
          <DialogHeader className="shrink-0 border-b border-border/60 px-6 py-5 pr-14">
            <div className="space-y-1.5">
              <p className="ui-eyebrow text-muted-foreground">Delete Record</p>
              <DialogTitle className="text-[1.4rem] font-black tracking-tight text-foreground">
                {title}
              </DialogTitle>
              <DialogDescription className="max-w-xl text-[13px] leading-6 text-muted-foreground">
                {description}
              </DialogDescription>
            </div>
          </DialogHeader>

          <DialogBody className="px-6 py-5">
            <div className="rounded-[1.2rem] border border-destructive/20 bg-destructive/5 p-4">
              <p className="font-semibold text-foreground">{primaryText}</p>
              {secondaryText ? (
                <p className="mt-1 text-sm text-muted-foreground">{secondaryText}</p>
              ) : null}
            </div>
          </DialogBody>

          <DialogFooter className="shrink-0 border-t border-border/60 bg-white px-6 py-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-border/60 bg-white hover:border-accent/35 hover:bg-white"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="rounded-2xl"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Permanently Delete"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MemberIdentitySummaryCard({ member }: { member: AdminMemberRow }) {
  return (
    <div className="rounded-[1.2rem] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,247,252,0.96)_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_12px_24px_-18px_rgba(11,18,32,0.12)]">
      <div className="mb-4">
        <PersonIdentityCell name={member.name} email={member.email} />
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <DetailLabel>Major</DetailLabel>
          <p className="mt-1 font-medium text-foreground">{member.major || "—"}</p>
        </div>

        <div>
          <DetailLabel>Academic Year</DetailLabel>
          <p className="mt-1 font-medium text-foreground">{member.academicYear || "—"}</p>
        </div>

        <div>
          <DetailLabel>Joined</DetailLabel>
          <p className="mt-1 font-medium text-foreground">{formatShortDate(member.createdAt)}</p>
        </div>

        <div>
          <DetailLabel>Last Updated</DetailLabel>
          <p className="mt-1 font-medium text-foreground">{formatShortDate(member.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
}

function MemberAccessSummaryCard({ member }: { member: AdminMemberRow }) {
  return (
    <DetailSection
      title="Access Management"
      icon={<ShieldCheck className="h-4 w-4 text-primary" />}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <DetailLabel>Role</DetailLabel>
          <div className="mt-1">
            <MemberRoleBadge role={member.role} />
          </div>
        </div>

        <div>
          <DetailLabel>Status</DetailLabel>
          <div className="mt-1">
            <MemberStatusBadge status={member.status} />
          </div>
        </div>

        <div className="sm:col-span-2">
          <DetailLabel>Sub-Role</DetailLabel>
          <p className="mt-1 text-sm font-medium text-foreground">
            {member.subRole?.trim() || "—"}
          </p>
        </div>
      </div>
    </DetailSection>
  );
}

function MemberPointsSummaryCard({ member }: { member: AdminMemberRow }) {
  return (
    <DetailSection
      title="Points Summary"
      icon={<Award className="h-4 w-4 text-primary" />}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <DetailStatCard label="Total Points" value={member.pointsTotal} />
        <DetailStatCard label="Events Attended" value={member.eventsAttendedCount} />
      </div>
    </DetailSection>
  );
}

export function MemberOverviewSections({
  member,
  isActing = false,
  onApprove,
  onSetInactive,
  onReactivate,
}: {
  member: AdminMemberRow;
  isActing?: boolean;
  onApprove: () => void;
  onSetInactive: () => void;
  onReactivate: () => void;
}) {
  return (
    <div className="mt-1 min-w-0 space-y-5">
      <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] xl:items-start">
        <div className="min-w-0 rounded-[1.35rem] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,247,252,0.96)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_12px_24px_-18px_rgba(11,18,32,0.12)] sm:p-5">
          <div className="space-y-5">
            <PersonIdentityCell name={member.name} email={member.email} />

            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <DetailLabel>Major</DetailLabel>
                <p className="mt-1 break-words font-medium text-foreground">
                  {member.major || "—"}
                </p>
              </div>

              <div className="min-w-0">
                <DetailLabel>Academic Year</DetailLabel>
                <p className="mt-1 break-words font-medium text-foreground">
                  {member.academicYear || "—"}
                </p>
              </div>

              <div className="min-w-0">
                <DetailLabel>Joined</DetailLabel>
                <p className="mt-1 break-words font-medium text-foreground">
                  {formatShortDate(member.createdAt)}
                </p>
              </div>

              <div className="min-w-0">
                <DetailLabel>Last Updated</DetailLabel>
                <p className="mt-1 break-words font-medium text-foreground">
                  {formatShortDate(member.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid min-w-0 gap-5">
          <DetailSection
            title="Access Management"
            icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
          >
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <DetailLabel>Role</DetailLabel>
                <div className="mt-2 flex flex-wrap gap-2">
                  <MemberRoleBadge role={member.role} />
                </div>
              </div>

              <div className="min-w-0">
                <DetailLabel>Status</DetailLabel>
                <div className="mt-2 flex flex-wrap gap-2">
                  <MemberStatusBadge status={member.status} />
                </div>
              </div>

              <div className="min-w-0 sm:col-span-2">
                <DetailLabel>Sub-Role</DetailLabel>
                <p className="mt-2 break-words text-sm font-medium text-foreground">
                  {member.subRole?.trim() || "—"}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <MemberQuickStatusButton
                status={member.status}
                loading={isActing}
                onApprove={onApprove}
                onSetInactive={onSetInactive}
                onReactivate={onReactivate}
              />
            </div>
          </DetailSection>

          <DetailSection
            title="Points Summary"
            icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
          >
            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="min-w-0 rounded-[1.15rem] border border-border/60 bg-white/70 px-4 py-4 text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                  Total Points
                </p>
                <p className="mt-3 break-words text-[2rem] font-black leading-none tracking-tight text-foreground">
                  {member.pointsTotal}
                </p>
              </div>

              <div className="min-w-0 rounded-[1.15rem] border border-border/60 bg-white/70 px-4 py-4 text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                  Events Attended
                </p>
                <p className="mt-3 break-words text-[2rem] font-black leading-none tracking-tight text-foreground">
                  {member.eventsAttendedCount}
                </p>
              </div>
            </div>
          </DetailSection>
        </div>
      </section>

      <DetailSection
        title="Attendance History"
        icon={<CalendarCheck2 className="h-4 w-4 text-primary" />}
      >
        <div className="space-y-2">
          {member.attendancePreview.length > 0 ? (
            member.attendancePreview.map((entry) => (
              <div
                key={`${member.id}-${entry.eventId}`}
                className="min-w-0 rounded-2xl border border-border/50 bg-background/70 px-4 py-3"
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
            <div className="rounded-2xl border border-dashed border-border/60 bg-background/50 px-4 py-6 text-center text-sm text-muted-foreground">
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
      </DetailSection>
    </div>
  );
}