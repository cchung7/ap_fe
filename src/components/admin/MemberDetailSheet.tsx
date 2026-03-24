"use client";

import * as React from "react";
import { CalendarCheck2, Shield, Star, Users } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MemberOverviewSections } from "@/components/admin/AdminEntityUI";
import type { AdminMemberRow } from "@/data/mockAdminMembers";

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