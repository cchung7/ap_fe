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
  Dialog,
  DialogBody,
  DialogContent,
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

type MemberEditDialogProps = {
  member: AdminMemberRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editRole: AdminMemberRow["role"];
  setEditRole: (value: AdminMemberRow["role"]) => void;
  editStatus: AdminMemberRow["status"];
  setEditStatus: (value: AdminMemberRow["status"]) => void;
  editSubRole: string;
  setEditSubRole: (value: string) => void;
  saving: boolean;
  onSave: () => void;
};

const FIELD_LABEL_CLASS =
  "text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/80";

const INPUT_CLASS =
  "h-11 rounded-[1rem] border border-[rgba(11,45,91,0.10)] bg-white text-[14px] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_24px_-18px_rgba(11,18,32,0.10)] placeholder:text-[12px] placeholder:text-muted-foreground/80 focus-visible:border-accent/45 focus-visible:ring-[3px] focus-visible:ring-[rgba(177,18,38,0.12)]";

function HeaderStatusShortcut({
  status,
  disabled,
  onChange,
}: {
  status: AdminMemberRow["status"];
  disabled?: boolean;
  onChange: (value: AdminMemberRow["status"]) => void;
}) {
  if (status === "PENDING") {
    return (
      <Button
        type="button"
        size="sm"
        disabled={disabled}
        onClick={() => onChange("ACTIVE")}
        className="min-w-[170px] rounded-2xl border border-green-300 bg-green-600 px-4 text-sm font-semibold text-white shadow-[0_16px_34px_-18px_rgba(22,101,52,0.35)] hover:border-green-700 hover:bg-green-700"
      >
        {disabled ? (
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
        disabled={disabled}
        onClick={() => onChange("SUSPENDED")}
        className="min-w-[170px] rounded-2xl border border-orange-300 bg-orange-500 px-4 text-sm font-semibold text-white shadow-[0_16px_34px_-18px_rgba(194,65,12,0.35)] hover:border-orange-600 hover:bg-orange-600"
      >
        {disabled ? (
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
      disabled={disabled}
      onClick={() => onChange("ACTIVE")}
      className="min-w-[170px] rounded-2xl border border-green-300 bg-green-600 px-4 text-sm font-semibold text-white shadow-[0_16px_34px_-18px_rgba(22,101,52,0.35)] hover:border-green-700 hover:bg-green-700"
    >
      {disabled ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RotateCcw className="h-4 w-4" />
      )}
      Reactivate
    </Button>
  );
}

export function MemberEditDialog({
  member,
  open,
  onOpenChange,
  editRole,
  setEditRole,
  editStatus,
  setEditStatus,
  editSubRole,
  setEditSubRole,
  saving,
  onSave,
}: MemberEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={[
          "w-[min(44rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)] overflow-hidden p-0",
          "sm:w-[min(44rem,calc(100vw-2rem))] sm:max-w-[calc(100vw-2rem)]",
          "rounded-[1.75rem] border-2 border-[rgba(11,45,91,0.28)] bg-white",
          "shadow-[0_32px_90px_-24px_rgba(11,18,32,0.42),0_18px_36px_-22px_rgba(11,45,91,0.30)]",
          "ring-1 ring-white",
        ].join(" ")}
      >
        {member && (
          <div className="relative flex max-h-[calc(100vh-1rem)] min-h-0 flex-col overflow-hidden rounded-[1.75rem] bg-white sm:max-h-[calc(100vh-2rem)]">
            <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] border border-white/70" />

            <DialogHeader className="relative shrink-0 overflow-hidden border-b border-[rgba(11,45,91,0.14)] bg-[linear-gradient(180deg,rgba(238,243,251,0.92)_0%,rgba(255,255,255,1)_100%)] px-4 py-4 pr-16 sm:px-5 sm:py-5 sm:pr-20 lg:px-6 lg:pr-24">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,rgba(11,45,91,0.85)_0%,rgba(177,18,38,0.85)_100%)]" />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1.5 text-center sm:text-left">
                  <p className="ui-eyebrow text-muted-foreground">Member Access</p>
                  <DialogTitle className="text-[1.35rem] font-black tracking-tight text-foreground sm:text-[1.55rem]">
                    Edit Member Access
                  </DialogTitle>
                  <DialogDescription className="max-w-2xl text-[13px] leading-6 text-muted-foreground">
                    Update user access, status, and sub-role settings.
                  </DialogDescription>
                </div>

                <div className="flex w-full shrink-0 justify-center sm:w-auto sm:justify-end">
                  <HeaderStatusShortcut
                    status={editStatus}
                    disabled={saving}
                    onChange={setEditStatus}
                  />
                </div>
              </div>
            </DialogHeader>

            <DialogBody className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
              <div className="space-y-5">
                <AdminDetailCardShell
                  title="Profile Overview"
                  eyebrow="Membership"
                  icon={<CheckCircle2 className="h-4 w-4" />}
                >
                  <div className="space-y-5">
                    <PersonIdentityCell name={member.name} email={member.email} />

                    <div className="flex flex-wrap items-center gap-2">
                      <MemberRoleBadge role={editRole} />
                      <MemberStatusBadge status={editStatus} />
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

                <AdminDetailCardShell
                  title="Access Controls"
                  eyebrow="Permissions"
                  icon={<ShieldCheck className="h-4 w-4" />}
                >
                  <div className="space-y-1.5">
                    <p className="text-[13px] leading-6 text-muted-foreground">
                      Adjust the member’s role, account status, and admin-facing sub-role.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="space-y-2">
                      <label className={FIELD_LABEL_CLASS}>Role</label>
                      <Select
                        value={editRole}
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
                      <label className={FIELD_LABEL_CLASS}>Status</label>
                      <Select
                        value={editStatus}
                        onValueChange={(value) =>
                          setEditStatus(value as AdminMemberRow["status"])
                        }
                      >
                        <SelectTrigger className={INPUT_CLASS + " w-full"}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="SUSPENDED">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 sm:col-span-2 xl:col-span-1">
                      <label className={FIELD_LABEL_CLASS}>Sub-Role</label>
                      <Input
                        value={editSubRole}
                        onChange={(e) => setEditSubRole(e.target.value)}
                        placeholder="e.g. Treasurer"
                        className={INPUT_CLASS}
                      />
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
            </DialogBody>

            <DialogFooter className="shrink-0 flex-row flex-wrap justify-center gap-3 border-t border-[rgba(11,45,91,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(247,250,253,0.96)_100%)] px-4 py-4 sm:px-5 sm:justify-center lg:px-6">
              <Button
                type="button"
                className="min-w-[140px] rounded-2xl bg-red-600 text-white shadow-[0_16px_34px_-18px_rgba(185,28,28,0.35)] hover:bg-red-700 focus-visible:ring-red-200"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                type="button"
                className="min-w-[140px] rounded-2xl bg-green-600 text-white shadow-[0_16px_34px_-18px_rgba(22,101,52,0.35)] hover:bg-green-700"
                onClick={onSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}