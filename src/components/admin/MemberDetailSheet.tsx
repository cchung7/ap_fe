"use client";

import * as React from "react";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemberOverviewSections } from "@/components/admin/AdminEntityUI";
import type { AdminMemberRow } from "@/types/admin";

export function MemberDetailSheet({
  member,
  open,
  onOpenChange,
}: {
  member: AdminMemberRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(72rem,calc(100vw-2rem))] p-0">
        {member && (
          <div className="flex max-h-[calc(100vh-2rem)] min-h-0 flex-col bg-white">
            <DialogHeader className="shrink-0 border-b border-border/60 px-6 py-5 pr-14">
              <div className="space-y-1.5">
                <p className="ui-eyebrow text-muted-foreground">Member Record</p>
                <DialogTitle className="text-[1.55rem] font-black tracking-tight text-foreground sm:text-[1.75rem]">
                  Member Overview
                </DialogTitle>
                <DialogDescription className="max-w-2xl text-[13px] leading-6 text-muted-foreground">
                  Review member profile details, access level, points, and attendance summary.
                </DialogDescription>
              </div>
            </DialogHeader>

            <DialogBody className="min-h-0 flex-1 overflow-y-auto px-6 py-6 lg:px-7">
              <MemberOverviewSections member={member} />
            </DialogBody>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}