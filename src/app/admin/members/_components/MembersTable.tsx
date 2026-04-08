"use client";

import * as React from "react";

import type { AdminMemberRow } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MemberStatusBadge,
  PersonIdentityCell,
} from "@/components/admin/AdminEntityUI";
import { MembersTableRowActions } from "./MembersTableRowActions";

type MembersTableProps = {
  members: AdminMemberRow[];
  deletingMemberId: string | null;
  onView: (member: AdminMemberRow) => void;
  onEdit: (member: AdminMemberRow) => void;
  onDelete: (member: AdminMemberRow) => void;
};

export function MembersTable({
  members,
  deletingMemberId,
  onView,
  onEdit,
  onDelete,
}: MembersTableProps) {
  return (
    <Table className="w-full min-w-[620px] table-fixed border-separate border-spacing-0 text-[13px]">
      <colgroup>
        <col className="w-[50%]" />
        <col className="w-[20%]" />
        <col className="w-[30%]" />
      </colgroup>

      <TableHeader className="bg-secondary/20">
        <TableRow>
          <TableHead className="border-b border-r border-border/60 px-3 py-3 text-center text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground/85 sm:px-4">
            List of all Members
          </TableHead>

          <TableHead className="border-b border-r border-border/60 px-3 py-3 text-center text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground/85 sm:px-4">
            Activity Status
          </TableHead>

          <TableHead className="border-b border-border/60 px-3 py-3 text-center text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground/85 sm:px-4">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {members.map((member) => (
          <TableRow
            key={member.id}
            className="bg-white/55 transition-colors hover:bg-white/82"
          >
            <TableCell className="border-b border-r border-border/50 px-3 py-3 align-middle sm:px-4">
              <div className="min-w-0">
                <PersonIdentityCell name={member.name} email={member.email} />
              </div>
            </TableCell>

            <TableCell className="border-b border-r border-border/50 px-3 py-3 align-middle text-center sm:px-4">
              <div className="flex justify-center">
                <MemberStatusBadge status={member.status} />
              </div>
            </TableCell>

            <TableCell className="border-b border-border/50 px-3 py-3 align-middle sm:px-4">
              <MembersTableRowActions
                isDeleting={deletingMemberId === member.id}
                onView={() => onView(member)}
                onEdit={() => onEdit(member)}
                onDelete={() => onDelete(member)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}