"use client";

import * as React from "react";
import {
  Award,
  CheckCircle2,
  Loader2,
  PauseCircle,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import type { AdminMemberRow } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PersonIdentityCell,
  formatShortDate,
  MemberRoleBadge,
  MemberStatusBadge,
} from "@/components/admin/AdminEntityUI";
import {
  AdminDetailCardShell,
  AdminInfoItem,
  AdminStatTile,
} from "@/components/admin/AdminDetailPrimitives";
import {
  ADMIN_DIALOG_CANCEL_BUTTON_CLASSNAME,
  ADMIN_DIALOG_SAVE_BUTTON_CLASSNAME,
} from "@/components/admin/AdminDialogButtonStyles";

const FIELD_LABEL_CLASS =
  "text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/80";

const INPUT_CLASS =
  "h-11 rounded-[1rem] border border-[rgba(11,45,91,0.10)] bg-white text-[14px] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_24px_-18px_rgba(11,18,32,0.10)] placeholder:text-[12px] placeholder:text-muted-foreground/80 focus-visible:border-accent/45 focus-visible:ring-[3px] focus-visible:ring-[rgba(177,18,38,0.12)]";

export function HeaderStatusShortcut({
  status,
  disabled,
  loading,
  onChange,
}: {
  status: AdminMemberRow["status"];
  disabled?: boolean;
  loading?: boolean;
  onChange: (value: AdminMemberRow["status"]) => void;
}) {
  const isDisabled = Boolean(disabled || loading);

  if (status === "PENDING") {
    return (
      <Button
        type="button"
        size="sm"
        disabled={isDisabled}
        onClick={() => onChange("ACTIVE")}
        className="min-w-[170px] rounded-2xl border border-green-300 bg-green-600 px-4 text-sm font-semibold text-white shadow-[0_16px_34px_-18px_rgba(22,101,52,0.35)] hover:border-green-700 hover:bg-green-700"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        Activate Member
      </Button>
    );
  }

  if (status === "ACTIVE") {
    return (
      <Button
        type="button"
        size="sm"
        disabled={isDisabled}
        onClick={() => onChange("SUSPENDED")}
        className="min-w-[170px] rounded-2xl border border-orange-300 bg-orange-500 px-4 text-sm font-semibold text-white shadow-[0_16px_34px_-18px_rgba(194,65,12,0.35)] hover:border-orange-600 hover:bg-orange-600"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <PauseCircle className="h-4 w-4" />
        )}
        Deaactive Member
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="sm"
      disabled={isDisabled}
      onClick={() => onChange("ACTIVE")}
      className="min-w-[170px] rounded-2xl border border-green-300 bg-green-600 px-4 text-sm font-semibold text-white shadow-[0_16px_34px_-18px_rgba(22,101,52,0.35)] hover:border-green-700 hover:bg-green-700"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RotateCcw className="h-4 w-4" />
      )}
      Reactivate Member
    </Button>
  );
}

export function MemberEditDialogHeader({
  disabled,
  statusActionLoading,
  status,
  onStatusShortcut,
}: {
  disabled: boolean;
  statusActionLoading: boolean;
  status: AdminMemberRow["status"];
  onStatusShortcut: (value: AdminMemberRow["status"]) => void;
}) {
  return (
    <DialogHeader className="relative shrink-0 overflow-hidden border-b border-[rgba(11,45,91,0.14)] bg-[linear-gradient(180deg,rgba(238,243,251,0.92)_0%,rgba(255,255,255,1)_100%)] px-4 py-4 pr-16 sm:px-5 sm:py-5 sm:pr-20 lg:px-6 lg:pr-24">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,rgba(11,45,91,0.85)_0%,rgba(177,18,38,0.85)_100%)]" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1.5 text-center sm:text-left">
          <p className="ui-eyebrow text-muted-foreground">Member Access</p>
          <DialogTitle className="text-[1.35rem] font-black tracking-tight text-foreground sm:text-[1.55rem]">
            Edit Member Access
          </DialogTitle>
          <DialogDescription className="max-w-2xl text-[13px] leading-6 text-muted-foreground">
            Update the member’s role and sub-role here. Account status is
            updated instantly using the shortcut button.
          </DialogDescription>
        </div>

        <div className="flex w-full shrink-0 justify-center sm:w-auto sm:justify-end">
          <HeaderStatusShortcut
            status={status}
            disabled={disabled}
            loading={statusActionLoading}
            onChange={onStatusShortcut}
          />
        </div>
      </div>
    </DialogHeader>
  );
}

export function MemberProfileOverviewSection({
  member,
  editRole,
  status,
  editSubRole,
}: {
  member: AdminMemberRow;
  editRole: AdminMemberRow["role"];
  status: AdminMemberRow["status"];
  editSubRole: string;
}) {
  return (
    <AdminDetailCardShell
      title="Profile Overview"
      eyebrow="Membership"
      icon={<CheckCircle2 className="h-4 w-4" />}
    >
      <div className="space-y-5">
        <PersonIdentityCell name={member.name} email={member.email} />

        <div className="flex flex-wrap items-center gap-2">
          <MemberRoleBadge role={editRole} />
          <MemberStatusBadge status={status} />
          {editSubRole.trim() ? (
            <span className="inline-flex rounded-full border border-[rgba(11,45,91,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,249,252,0.98)_100%)] px-3 py-1 text-[11px] font-semibold text-foreground shadow-[0_8px_20px_-16px_rgba(11,18,32,0.18)]">
              {editSubRole.trim()}
            </span>
          ) : null}
        </div>

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
  );
}

export function MemberAccessControlsSection({
  editRole,
  setEditRole,
  status,
  editSubRole,
  setEditSubRole,
  disabled = false,
}: {
  editRole: AdminMemberRow["role"];
  setEditRole: (value: AdminMemberRow["role"]) => void;
  status: AdminMemberRow["status"];
  editSubRole: string;
  setEditSubRole: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <AdminDetailCardShell
      title="Access Controls"
      eyebrow="Permissions"
      icon={<ShieldCheck className="h-4 w-4" />}
    >
      <div className="space-y-1.5">
        <p className="text-[13px] leading-6 text-muted-foreground">
          Adjust the member’s role and admin-facing sub-role here. Account
          status is controlled separately using the shortcut button in the
          dialog header.
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="space-y-2">
          <label className={FIELD_LABEL_CLASS}>Role</label>
          <Select
            value={editRole}
            disabled={disabled}
            onValueChange={(value) =>
              setEditRole(value as AdminMemberRow["role"])
            }
          >
            <SelectTrigger className={INPUT_CLASS + " w-full"}>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MEMBER">Member</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className={FIELD_LABEL_CLASS}>Account Status</label>
          <div className="flex min-h-11 items-center gap-2 rounded-[1rem] border border-[rgba(11,45,91,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(247,249,252,0.98)_100%)] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_24px_-18px_rgba(11,18,32,0.10)]">
            <MemberStatusBadge status={status} />
            <span className="text-[12px] leading-5 text-muted-foreground">
              Updated instantly from the header button.
            </span>
          </div>
        </div>

        <div className="space-y-2 sm:col-span-2 xl:col-span-1">
          <label className={FIELD_LABEL_CLASS}>Sub-Role</label>
          <Input
            value={editSubRole}
            disabled={disabled}
            onChange={(e) => setEditSubRole(e.target.value)}
            placeholder="e.g. Treasurer"
            className={INPUT_CLASS}
          />
        </div>
      </div>
    </AdminDetailCardShell>
  );
}

export function MemberPointsSummarySection({
  member,
}: {
  member: AdminMemberRow;
}) {
  return (
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
  );
}

export function MemberEditDialogFooter({
  saving,
  disabled,
  onCancel,
  onSave,
}: {
  saving: boolean;
  disabled: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <DialogFooter className="shrink-0 flex-row flex-wrap justify-center gap-3 border-t border-[rgba(11,45,91,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(247,250,253,0.96)_100%)] px-4 py-4 sm:px-5 sm:justify-center lg:px-6">
      <Button
        type="button"
        className={ADMIN_DIALOG_CANCEL_BUTTON_CLASSNAME}
        onClick={onCancel}
        disabled={disabled}
      >
        Cancel
      </Button>

      <Button
        type="button"
        className={ADMIN_DIALOG_SAVE_BUTTON_CLASSNAME}
        onClick={onSave}
        disabled={disabled}
      >
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </DialogFooter>
  );
}