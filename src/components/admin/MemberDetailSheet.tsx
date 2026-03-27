"use client";

import * as React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MemberOverviewSections } from "@/components/admin/AdminEntityUI";
import type { AdminMemberRow } from "@/types/admin";

type MemberDetailSheetProps = {
  member: AdminMemberRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MemberDetailSheet({
  member,
  open,
  onOpenChange,
}: MemberDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        {member && (
          <>
            <SheetHeader>
              <SheetTitle>Member Overview</SheetTitle>
              <SheetDescription>
                Review member profile, access level, points, and attendance summary.
              </SheetDescription>
            </SheetHeader>

            <MemberOverviewSections member={member} />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}