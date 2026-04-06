"use client";

import * as React from "react";

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

const SECTION_CLASS =
  "rounded-[1.35rem] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,247,252,0.96)_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_12px_24px_-18px_rgba(11,18,32,0.12)]";

function SummaryStat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-[1rem] border border-border/60 bg-white/70 px-4 py-4">
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-[1.1rem] font-black tracking-tight text-foreground">
        {value}
      </p>
    </div>
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
      <DialogContent className="max-w-[min(44rem,calc(100vw-2rem))] p-0">
        {member && (
          <div className="flex max-h-[calc(100vh-2rem)] min-h-0 flex-col bg-white">
            <DialogHeader className="shrink-0 border-b border-border/60 px-6 py-5 pr-14">
              <div className="space-y-1.5">
                <p className="ui-eyebrow text-muted-foreground">Member Access</p>
                <DialogTitle className="text-[1.45rem] font-black tracking-tight text-foreground sm:text-[1.65rem]">
                  Edit Member Access
                </DialogTitle>
                <DialogDescription className="max-w-2xl text-[13px] leading-6 text-muted-foreground">
                  Update admin-controlled access, status, and sub-role settings for this member.
                </DialogDescription>
              </div>
            </DialogHeader>

            <DialogBody className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <div className="space-y-5">
                <section className={SECTION_CLASS}>
                  <div className="space-y-4">
                    <PersonIdentityCell name={member.name} email={member.email} />

                    <div className="flex flex-wrap items-center gap-2">
                      <MemberRoleBadge role={member.role} />
                      <MemberStatusBadge status={member.status} />
                      {member.subRole?.trim() ? (
                        <span className="inline-flex rounded-full border border-border/70 bg-white px-3 py-1 text-[11px] font-semibold text-foreground shadow-[0_8px_20px_-16px_rgba(11,18,32,0.18)]">
                          {member.subRole.trim()}
                        </span>
                      ) : null}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          Joined
                        </p>
                        <p className="mt-1 text-sm text-foreground">
                          {formatShortDate(member.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          Last Updated
                        </p>
                        <p className="mt-1 text-sm text-foreground">
                          {formatShortDate(member.updatedAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          Major
                        </p>
                        <p className="mt-1 text-sm text-foreground">
                          {member.major || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          Academic Year
                        </p>
                        <p className="mt-1 text-sm text-foreground">
                          {member.academicYear || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className={SECTION_CLASS}>
                  <div className="space-y-1.5">
                    <h3 className="text-[1.08rem] font-black tracking-tight text-foreground">
                      Access Controls
                    </h3>
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
                </section>

                <section className="rounded-[1.35rem] border border-border/60 bg-secondary/15 p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <SummaryStat label="Total Points" value={member.pointsTotal} />
                    <SummaryStat
                      label="Events Attended"
                      value={member.eventsAttendedCount}
                    />
                  </div>
                </section>
              </div>
            </DialogBody>

            <DialogFooter className="shrink-0 border-t border-border/60 bg-white px-6 py-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl border-border/60 bg-white hover:border-accent/35 hover:bg-white"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                type="button"
                className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/92"
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