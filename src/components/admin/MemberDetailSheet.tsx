"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemberDetailContent } from "@/components/admin/MemberDetailContent";
import type { AdminMemberRow } from "@/types/admin";

export function MemberDetailSheet({
  member,
  open,
  onOpenChange,
  actionMemberId: _actionMemberId,
  onApprove: _onApprove,
  onSetInactive: _onSetInactive,
  onReactivate: _onReactivate,
}: {
  member: AdminMemberRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionMemberId: string | null;
  onApprove: (memberId: string) => void;
  onSetInactive: (memberId: string) => void;
  onReactivate: (memberId: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={[
          "w-[min(64rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)] overflow-hidden p-0",
          "sm:w-[min(64rem,calc(100vw-2rem))] sm:max-w-[calc(100vw-2rem)]",
          "rounded-[1.75rem] border-2 border-[rgba(11,45,91,0.28)] bg-white",
          "shadow-[0_32px_90px_-24px_rgba(11,18,32,0.42),0_18px_36px_-22px_rgba(11,45,91,0.30)]",
          "ring-1 ring-white",
        ].join(" ")}
      >
        {member && (
          <div className="relative flex max-h-[calc(100vh-1rem)] min-h-0 flex-col overflow-hidden rounded-[1.75rem] bg-white sm:max-h-[calc(100vh-2rem)]">
            <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] border border-white/70" />

            <DialogHeader className="relative shrink-0 overflow-hidden border-b border-[rgba(11,45,91,0.14)] bg-[linear-gradient(180deg,rgba(238,243,251,0.92)_0%,rgba(255,255,255,1)_100%)] px-4 py-4 pr-14 sm:px-5 sm:py-5 lg:px-6">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,rgba(11,45,91,0.85)_0%,rgba(177,18,38,0.85)_100%)]" />

              <div className="space-y-1.5">
                <p className="ui-eyebrow text-muted-foreground">Member Record</p>

                <DialogTitle className="text-[1.35rem] font-black tracking-tight text-foreground sm:text-[1.55rem]">
                  Member Overview
                </DialogTitle>

                <DialogDescription className="max-w-2xl text-[13px] leading-6 text-muted-foreground">
                  Review member profile details, access level, points, and attendance summary.
                </DialogDescription>
              </div>
            </DialogHeader>

            <DialogBody className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
              <MemberDetailContent member={member} />
            </DialogBody>

            <DialogFooter className="shrink-0 justify-center gap-3 border-t border-[rgba(11,45,91,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,247,252,0.96)_100%)] px-4 py-3 sm:px-5 sm:justify-center sm:py-4 lg:px-6">
              <Button
                type="button"
                className="min-w-[152px] rounded-2xl border border-red-700/10 bg-[linear-gradient(135deg,rgba(220,38,38,1)_0%,rgba(185,28,28,1)_100%)] px-4 text-white shadow-[0_14px_30px_-18px_rgba(185,28,28,0.42)] hover:bg-[linear-gradient(135deg,rgba(185,28,28,1)_0%,rgba(153,27,27,1)_100%)]"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}