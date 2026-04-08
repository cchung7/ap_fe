"use client";

import * as React from "react";

import type { AdminMemberRow } from "@/types/admin";
import { AdminTableViewport } from "@/components/ui/table";
import { MembersTable } from "./MembersTable";

type MembersTableSectionProps = {
  members: AdminMemberRow[];
  loading: boolean;
  error: string | null;
  deletingMemberId: string | null;
  onView: (member: AdminMemberRow) => void;
  onEdit: (member: AdminMemberRow) => void;
  onDelete: (member: AdminMemberRow) => void;
};

export function MembersTableSection({
  members,
  loading,
  error,
  deletingMemberId,
  onView,
  onEdit,
  onDelete,
}: MembersTableSectionProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-[1.55rem] border border-border/60 bg-white/72 shadow-master backdrop-blur-md">
      <div className="border-b border-border/60 px-5 py-4.5 sm:px-6 sm:py-5">
        <p className="ui-eyebrow text-muted-foreground">Members Directory</p>
        <h2 className="mt-1 text-[1.18rem] font-black tracking-tight text-foreground">
          All Members
        </h2>
        <p className="mt-1 max-w-2xl text-[13px] leading-6 text-muted-foreground">
          Review member accounts, monitor activity status, and launch management
          actions from a cleaner directory view.
        </p>
      </div>

      <div className="min-w-0">
        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground sm:px-6">
            Loading members...
          </div>
        ) : error ? (
          <div className="px-5 py-10 text-center text-sm text-destructive sm:px-6">
            {error}
          </div>
        ) : members.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground sm:px-6">
            No members found.
          </div>
        ) : (
          <div className="min-w-0 px-3 pb-3 pt-3 sm:px-4 sm:pb-4">
            <div className="min-w-0 overflow-hidden rounded-[1.35rem] border border-[rgba(11,45,91,0.08)] bg-[linear-gradient(180deg,rgba(248,250,252,0.88)_0%,rgba(255,255,255,0.96)_100%)]">
              <AdminTableViewport className="w-full overflow-x-auto overscroll-x-contain cursor-grab active:cursor-grabbing">
                <MembersTable
                  members={members}
                  deletingMemberId={deletingMemberId}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </AdminTableViewport>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}