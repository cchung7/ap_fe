"use client";

import * as React from "react";
import { Users } from "lucide-react";

import AdminHeader from "../_components/AdminHeader/AdminHeader";
import type { AdminMemberRow } from "@/types/admin";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";
import {
  ConfirmDeleteDialog,
  EditButton,
  MemberQuickStatusButton,
  MemberRoleBadge,
  MemberStatusBadge,
  PersonIdentityCell,
  ViewButton,
  DeleteButton,
  formatShortDate,
} from "@/components/admin/AdminEntityUI";
import { MemberDetailSheet } from "@/components/admin/MemberDetailSheet";
import { MemberEditDialog } from "@/components/admin/MemberEditDialog";

type MembersApiResponse = {
  success?: boolean;
  message?: string;
  data?: AdminMemberRow[];
};

type MemberApiResponse = {
  success?: boolean;
  message?: string;
  data?: AdminMemberRow | { id: string } | null;
};

function MembersSummary({
  totalMembers,
  activeMembers,
  pendingMembers,
}: {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
}) {
  const cardClass =
    "rounded-[1.2rem] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,247,252,0.96)_100%)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_12px_24px_-18px_rgba(11,18,32,0.12)]";

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className={cardClass}>
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">
          Active Members
        </p>
        <p className="mt-2 text-[2rem] font-black leading-none tracking-tight text-foreground">
          {activeMembers}
        </p>
      </div>

      <div className={cardClass}>
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">
          Pending Members
        </p>
        <p className="mt-2 text-[2rem] font-black leading-none tracking-tight text-foreground">
          {pendingMembers}
        </p>
      </div>

      <div className={cardClass}>
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">
          Total Members
        </p>
        <p className="mt-2 text-[2rem] font-black leading-none tracking-tight text-foreground">
          {totalMembers}
        </p>
      </div>
    </section>
  );
}

function MemberTagStrip({ member }: { member: AdminMemberRow }) {
  const badgeClass =
    "inline-flex h-8 items-center rounded-full border border-primary/18 bg-primary text-white px-3.5 text-[11px] font-semibold leading-none shadow-[0_8px_20px_-16px_rgba(11,18,32,0.18)]";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={badgeClass}>
        {member.status === "ACTIVE"
          ? "Active"
          : member.status === "PENDING"
            ? "Pending"
            : "Inactive"}
      </span>

      <span className={badgeClass}>
        {member.role === "ADMIN" ? "Admin" : "Member"}
      </span>

      {member.subRole?.trim() ? (
        <span className={badgeClass}>{member.subRole.trim()}</span>
      ) : null}
    </div>
  );
}

function MemberManagementRow({
  member,
  isActing,
  isDeleting,
  onApprove,
  onSetInactive,
  onReactivate,
  onView,
  onEdit,
  onDelete,
}: {
  member: AdminMemberRow;
  isActing: boolean;
  isDeleting: boolean;
  onApprove: () => void;
  onSetInactive: () => void;
  onReactivate: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-[1.35rem] border border-border/60 bg-white/72 shadow-master backdrop-blur-md">
      <div className="px-5 py-5 sm:px-6">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start xl:gap-8">
          <div className="min-w-0 space-y-4">
            <PersonIdentityCell name={member.name} email={member.email} />

            <MemberTagStrip member={member} />

            <p className="text-[13px] text-muted-foreground">
              Joined {formatShortDate(member.createdAt)}
            </p>
          </div>

          <div className="flex flex-col gap-3 xl:min-w-[360px] xl:items-end">
            <div className="flex flex-wrap items-center gap-2">
              <ViewButton
                onClick={onView}
                className="border-primary/15 bg-primary/5 text-primary hover:border-primary/30 hover:bg-primary/10"
              />

              <EditButton
                onClick={onEdit}
                className="border-border/70 bg-white hover:border-accent/35 hover:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <MemberQuickStatusButton
                status={member.status}
                loading={isActing}
                onApprove={onApprove}
                onSetInactive={onSetInactive}
                onReactivate={onReactivate}
              />

              <DeleteButton loading={isDeleting} onClick={onDelete} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function AdminMembersPage() {
  const { showError, showSuccess, clear } = useGlobalStatusBanner();

  const [members, setMembers] = React.useState<AdminMemberRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [viewingMember, setViewingMember] = React.useState<AdminMemberRow | null>(null);
  const [editingMember, setEditingMember] = React.useState<AdminMemberRow | null>(null);
  const [deletingMember, setDeletingMember] = React.useState<AdminMemberRow | null>(null);

  const [editRole, setEditRole] = React.useState<AdminMemberRow["role"]>("MEMBER");
  const [editStatus, setEditStatus] =
    React.useState<AdminMemberRow["status"]>("ACTIVE");
  const [editSubRole, setEditSubRole] = React.useState("");

  const [actionMemberId, setActionMemberId] = React.useState<string | null>(null);
  const [savingEdit, setSavingEdit] = React.useState(false);

  const pendingCount = React.useMemo(
    () => members.filter((member) => member.status === "PENDING").length,
    [members]
  );

  const activeCount = React.useMemo(
    () => members.filter((member) => member.status === "ACTIVE").length,
    [members]
  );

  const upsertMemberInState = React.useCallback((updatedMember: AdminMemberRow) => {
    setMembers((prev) =>
      prev.map((member) => (member.id === updatedMember.id ? updatedMember : member))
    );
    setViewingMember((prev) => (prev?.id === updatedMember.id ? updatedMember : prev));
    setEditingMember((prev) => (prev?.id === updatedMember.id ? updatedMember : prev));
  }, []);

  const removeMemberFromState = React.useCallback((memberId: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== memberId));
    setViewingMember((prev) => (prev?.id === memberId ? null : prev));
    setEditingMember((prev) => (prev?.id === memberId ? null : prev));
    setDeletingMember((prev) => (prev?.id === memberId ? null : prev));
  }, []);

  const loadMembers = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const json = (await res.json().catch(() => null)) as MembersApiResponse | null;

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to fetch members");
      }

      setMembers(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch members";
      setError(message);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  const handleOpenEdit = (member: AdminMemberRow) => {
    setEditingMember(member);
    setEditRole(member.role);
    setEditStatus(member.status);
    setEditSubRole(member.subRole ?? "");
  };

  const patchMember = React.useCallback(
    async (
      memberId: string,
      payload: Partial<Pick<AdminMemberRow, "role" | "status" | "subRole">>,
      successMessage?: string
    ) => {
      clear();
      setActionMemberId(memberId);

      try {
        const res = await fetch(`/api/admin/users/${memberId}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = (await res.json().catch(() => null)) as MemberApiResponse | null;

        if (!res.ok || !json?.success || !json?.data || Array.isArray(json.data)) {
          throw new Error(json?.message || "Failed to update member");
        }

        const updatedMember = json.data as AdminMemberRow;
        upsertMemberInState(updatedMember);
        showSuccess(successMessage || json.message || "Member updated successfully.");
        return updatedMember;
      } catch (err) {
        showError(err instanceof Error ? err.message : "Failed to update member");
        return null;
      } finally {
        setActionMemberId(null);
      }
    },
    [clear, showError, showSuccess, upsertMemberInState]
  );

  const handleApprove = async (memberId: string) => {
    await patchMember(memberId, { status: "ACTIVE" }, "Member set as active.");
  };

  const handleSetInactive = async (memberId: string) => {
    await patchMember(memberId, { status: "SUSPENDED" }, "Member set as inactive.");
  };

  const handleReactivate = async (memberId: string) => {
    await patchMember(memberId, { status: "ACTIVE" }, "Member reactivated successfully.");
  };

  const handleSaveEdit = async () => {
    if (!editingMember) return;

    setSavingEdit(true);
    const updated = await patchMember(
      editingMember.id,
      {
        role: editRole,
        status: editStatus,
        subRole: editSubRole.trim(),
      },
      "Member updated successfully."
    );
    setSavingEdit(false);

    if (updated) {
      setEditingMember(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingMember) return;

    clear();
    setActionMemberId(deletingMember.id);

    try {
      const res = await fetch(`/api/admin/users/${deletingMember.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = (await res.json().catch(() => null)) as MemberApiResponse | null;

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to delete member");
      }

      removeMemberFromState(deletingMember.id);
      showSuccess(json?.message || "Member deleted successfully.");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete member");
    } finally {
      setActionMemberId(null);
    }
  };

  return (
    <div className="space-y-5 overflow-hidden pt-6 pb-12 sm:space-y-6 sm:pt-7 sm:pb-16">
      <AdminHeader
        title="All Members"
        subtitle="Manage member access, review profiles, and handle status changes from one place."
        actionLabel={`Pending Approvals (${pendingCount})`}
        icon={Users}
        onAddClick={() => {}}
      />

      <MembersSummary
        totalMembers={members.length}
        activeMembers={activeCount}
        pendingMembers={pendingCount}
      />

      <section className="overflow-hidden rounded-[1.55rem] border border-border/60 bg-white/72 shadow-master backdrop-blur-md">
        <div className="border-b border-border/60 px-5 py-4.5 sm:px-6 sm:py-5">
          <p className="ui-eyebrow text-muted-foreground">Members Directory</p>
          <h2 className="mt-1 text-[1.18rem] font-black tracking-tight text-foreground">
            Member Management
          </h2>
          <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
            Lean member cards for quick review, with deeper details available through the profile sheet.
          </p>
        </div>

        <div className="px-4 py-4 sm:px-5 sm:py-5">
          {loading ? (
            <div className="rounded-[1.2rem] border border-dashed border-border/70 bg-white/60 px-5 py-10 text-center text-[13px] text-muted-foreground">
              Loading members...
            </div>
          ) : error ? (
            <div className="rounded-[1.2rem] border border-red-200 bg-red-50 px-5 py-10 text-center text-[13px] text-red-700">
              {error}
            </div>
          ) : members.length === 0 ? (
            <div className="rounded-[1.2rem] border border-dashed border-border/70 bg-white/60 px-5 py-10 text-center text-[13px] text-muted-foreground">
              No members found.
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => {
                const isActing = actionMemberId === member.id;
                const isDeleting = isActing && deletingMember?.id === member.id;

                return (
                  <MemberManagementRow
                    key={member.id}
                    member={member}
                    isActing={isActing}
                    isDeleting={isDeleting}
                    onApprove={() => void handleApprove(member.id)}
                    onSetInactive={() => void handleSetInactive(member.id)}
                    onReactivate={() => void handleReactivate(member.id)}
                    onView={() => setViewingMember(member)}
                    onEdit={() => handleOpenEdit(member)}
                    onDelete={() => setDeletingMember(member)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      <MemberDetailSheet
        member={viewingMember}
        open={!!viewingMember}
        onOpenChange={(open) => !open && setViewingMember(null)}
      />

      <MemberEditDialog
        member={editingMember}
        open={!!editingMember}
        onOpenChange={(open) => !open && setEditingMember(null)}
        editRole={editRole}
        setEditRole={setEditRole}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
        editSubRole={editSubRole}
        setEditSubRole={setEditSubRole}
        saving={savingEdit}
        onSave={() => void handleSaveEdit()}
      />

      <ConfirmDeleteDialog
        open={!!deletingMember}
        onOpenChange={(open) => !open && setDeletingMember(null)}
        title="Delete Member"
        description="This will permanently delete the member account. This action cannot be undone."
        primaryText={deletingMember?.name || ""}
        secondaryText={deletingMember?.email || ""}
        loading={actionMemberId === deletingMember?.id}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}