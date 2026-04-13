"use client";

import * as React from "react";

import type { AdminMemberRow } from "@/types/admin";
import { Dialog, DialogBody, DialogContent } from "@/components/ui/dialog";
import {
  MemberAccessControlsSection,
  MemberEditDialogFooter,
  MemberEditDialogHeader,
  MemberPointsSummarySection,
  MemberProfileOverviewSection,
} from "@/components/admin/MemberEditDialogSections";

type MemberEditDialogProps = {
  member: AdminMemberRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editRole: AdminMemberRow["role"];
  setEditRole: (value: AdminMemberRow["role"]) => void;
  editSubRole: string;
  setEditSubRole: (value: string) => void;
  saving: boolean;
  busy: boolean;
  statusActionLoading: boolean;
  onStatusShortcut: (value: AdminMemberRow["status"]) => void;
  onSave: () => void;
};

export function MemberEditDialog({
  member,
  open,
  onOpenChange,
  editRole,
  setEditRole,
  editSubRole,
  setEditSubRole,
  saving,
  busy,
  statusActionLoading,
  onStatusShortcut,
  onSave,
}: MemberEditDialogProps) {
  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (busy) return;
      onOpenChange(nextOpen);
    },
    [busy, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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

            <MemberEditDialogHeader
              disabled={busy}
              statusActionLoading={statusActionLoading}
              status={member.status}
              onStatusShortcut={onStatusShortcut}
            />

            <DialogBody className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
              <div className="space-y-5">
                <MemberProfileOverviewSection
                  member={member}
                  editRole={editRole}
                  status={member.status}
                  editSubRole={editSubRole}
                />

                <MemberAccessControlsSection
                  editRole={editRole}
                  setEditRole={setEditRole}
                  status={member.status}
                  editSubRole={editSubRole}
                  setEditSubRole={setEditSubRole}
                  disabled={busy}
                />

                <MemberPointsSummarySection member={member} />
              </div>
            </DialogBody>

            <MemberEditDialogFooter
              saving={saving}
              disabled={busy}
              onCancel={() => onOpenChange(false)}
              onSave={onSave}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}