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
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export function formatShortDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
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
  return (
    <Badge variant={getMemberStatusBadgeVariant(status)}>
      {formatMemberStatusLabel(status)}
    </Badge>
  );
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
  return <Badge variant={isCompleted ? "outline" : "default"}>{isCompleted ? "Completed" : "Upcoming"}</Badge>;
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

export function getMemberStatusBadgeVariant(
  status: "ACTIVE" | "PENDING" | "SUSPENDED"
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "PENDING":
      return "secondary";
    case "SUSPENDED":
      return "outline";
    default:
      return "outline";
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
        "h-8 rounded-lg px-2.5 text-[9px] font-black uppercase tracking-[0.15em]",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </Button>
  );
}

export function ViewButton(props: Omit<React.ComponentProps<typeof RowActionButton>, "variant" | "icon">) {
  return (
    <RowActionButton
      variant="outline"
      className="border-border/70"
      icon={<Eye className="h-3 w-3" />}
      {...props}
    >
      View
    </RowActionButton>
  );
}

export function EditButton(props: Omit<React.ComponentProps<typeof RowActionButton>, "variant" | "icon">) {
  return (
    <RowActionButton
      variant="outline"
      className="border-border/70"
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
      <RowActionButton
        disabled={loading}
        icon={loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
        onClick={onApprove}
      >
        Approve
      </RowActionButton>
    );
  }

  if (status === "ACTIVE") {
    return (
      <RowActionButton
        variant="outline"
        className="border-border/70"
        disabled={loading}
        icon={loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <PauseCircle className="h-3 w-3" />}
        onClick={onSetInactive}
      >
        Set Inactive
      </RowActionButton>
    );
  }

  return (
    <RowActionButton
      disabled={loading}
      icon={loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
      onClick={onReactivate}
    >
      Reactivate
    </RowActionButton>
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-4">
            <p className="font-semibold text-foreground">{primaryText}</p>
            {secondaryText ? (
              <p className="mt-1 text-sm text-muted-foreground">{secondaryText}</p>
            ) : null}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={loading}>
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
      </DialogContent>
    </Dialog>
  );
}

export function MemberOverviewSections({
  member,
}: {
  member: {
    name: string;
    email: string;
    role: "ADMIN" | "MEMBER";
    status: "ACTIVE" | "PENDING" | "SUSPENDED";
    subRole: string;
    major: string;
    academicYear: string;
    createdAt: string;
    updatedAt: string;
    pointsTotal: number;
    eventsAttendedCount: number;
    attendancePreview: Array<{
      eventId: string;
      title: string;
      dateLabel: string;
      statusLabel: "Checked In" | "Registered" | "Canceled";
      pointsAwarded: number;
    }>;
  };
}) {
  return (
    <div className="mt-4 grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <DetailSection title="Member Profile" icon={<CalendarCheck2 className="h-4 w-4 text-primary" />}>
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
        </DetailSection>

        <div className="space-y-4">
          <DetailSection title="Access Management" icon={<CheckCircle2 className="h-4 w-4 text-primary" />}>
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

          <DetailSection title="Points Summary" icon={<CheckCircle2 className="h-4 w-4 text-primary" />}>
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailStatCard label="Total Points" value={member.pointsTotal} />
              <DetailStatCard label="Events Attended" value={member.eventsAttendedCount} />
            </div>
          </DetailSection>
        </div>
      </div>

      <DetailSection title="Attendance History" icon={<CalendarCheck2 className="h-4 w-4 text-primary" />}>
        <div className="space-y-2">
          {member.attendancePreview.length > 0 ? (
            member.attendancePreview.map((entry) => (
              <div
                key={`${member.name}-${entry.eventId}`}
                className="rounded-2xl border border-border/50 bg-background/70 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">{entry.title}</p>
                    <p className="mt-1 text-[12px] text-muted-foreground">
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

        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" className="rounded-xl">
            Manage Attendance
          </Button>
          <Button type="button" variant="outline" size="sm" className="rounded-xl">
            Adjust Points
          </Button>
        </div>
      </DetailSection>
    </div>
  );
}