"use client";

import * as React from "react";

import type { AdminMemberRow } from "@/types/admin";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";
import { ConfirmDeleteDialog } from "@/components/admin/AdminEntityUI";
import { MemberDetailSheet } from "@/components/admin/MemberDetailSheet";
import { MemberEditDialog } from "@/components/admin/MemberEditDialog";

import { MembersPageHero } from "./_components/MembersPageHero";
import { MembersOverview } from "./_components/MembersOverview";
import { MembersTableSection } from "./_components/MembersTableSection";

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

  const inactiveCount = React.useMemo(
    () => members.filter((member) => member.status === "SUSPENDED").length,
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

  const handleOpenEdit = React.useCallback((member: AdminMemberRow) => {
    setEditingMember(member);
    setEditRole(member.role);
    setEditStatus(member.status);
    setEditSubRole(member.subRole ?? "");
  }, []);

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

  const handleApprove = React.useCallback(
    async (memberId: string) => {
      await patchMember(memberId, { status: "ACTIVE" }, "Member set as active.");
    },
    [patchMember]
  );

  const handleSetInactive = React.useCallback(
    async (memberId: string) => {
      await patchMember(memberId, { status: "SUSPENDED" }, "Member set as inactive.");
    },
    [patchMember]
  );

  const handleReactivate = React.useCallback(
    async (memberId: string) => {
      await patchMember(memberId, { status: "ACTIVE" }, "Member reactivated successfully.");
    },
    [patchMember]
  );

  const handleSaveEdit = React.useCallback(async () => {
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
  }, [editingMember, editRole, editStatus, editSubRole, patchMember]);

  const handleConfirmDelete = React.useCallback(async () => {
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
  }, [clear, deletingMember, removeMemberFromState, showError, showSuccess]);

  return (
    <div className="relative min-w-0 space-y-5 overflow-x-clip pt-5 pb-10 sm:space-y-6 sm:pt-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[20rem] bg-navy-wash opacity-75" />

      <MembersPageHero pendingCount={pendingCount} />

      <MembersOverview
        totalMembers={members.length}
        activeMembers={activeCount}
        pendingMembers={pendingCount}
        inactiveMembers={inactiveCount}
      />

      <MembersTableSection
        members={members}
        loading={loading}
        error={error}
        deletingMemberId={deletingMember?.id ?? null}
        onView={(member) => setViewingMember(member)}
        onEdit={handleOpenEdit}
        onDelete={(member) => setDeletingMember(member)}
      />

      <MemberDetailSheet
        member={viewingMember}
        open={!!viewingMember}
        onOpenChange={(open) => !open && setViewingMember(null)}
        actionMemberId={actionMemberId}
        onApprove={(memberId) => void handleApprove(memberId)}
        onSetInactive={(memberId) => void handleSetInactive(memberId)}
        onReactivate={(memberId) => void handleReactivate(memberId)}
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