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
      <DialogContent className="max-w-2xl">
        {member && (
          <>
            <DialogHeader>
              <DialogTitle>Edit Member Access</DialogTitle>
              <DialogDescription>
                Modify admin-controlled member fields only.
              </DialogDescription>
            </DialogHeader>

            <DialogBody>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                    Name
                  </label>
                  <Input value={member.name} readOnly />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                    Email
                  </label>
                  <Input value={member.email} readOnly />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                    Role
                  </label>
                  <Select
                    value={editRole}
                    onValueChange={(value) => setEditRole(value as AdminMemberRow["role"])}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEMBER">Member</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                    Status
                  </label>
                  <Select
                    value={editStatus}
                    onValueChange={(value) => setEditStatus(value as AdminMemberRow["status"])}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="SUSPENDED">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                    Sub-Role
                  </label>
                  <Input
                    value={editSubRole}
                    onChange={(e) => setEditSubRole(e.target.value)}
                    placeholder="e.g. Treasurer"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-secondary/10 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                  Read-Only Profile Summary
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-semibold text-foreground">Major</p>
                    <p className="text-sm text-muted-foreground">{member.major || "—"}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-foreground">
                      Academic Year
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.academicYear || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-foreground">
                      Total Points
                    </p>
                    <p className="text-sm text-muted-foreground">{member.pointsTotal}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-foreground">
                      Events Attended
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.eventsAttendedCount}
                    </p>
                  </div>
                </div>
              </div>
            </DialogBody>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="button" onClick={onSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}