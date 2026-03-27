// D:\ap_fe\src\app\admin\members\page.tsx
"use client";

import * as React from "react";
import { Users } from "lucide-react";

import AdminHeader from "../_components/AdminHeader/AdminHeader";
import type { AdminMemberRow } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  AdminDataTableCard,
  AdminTableViewport,
  AdminTableState,
} from "@/components/ui/table";
import {
  ConfirmDeleteDialog,
  EditButton,
  formatShortDate,
  LabeledBadgeStack,
  MemberQuickStatusButton,
  MemberRoleBadge,
  MemberStatusBadge,
  PersonIdentityCell,
  StackedInfoCell,
  ViewButton,
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
    await patchMember(memberId, { status: "ACTIVE" }, "Member approved successfully.");
  };

  const handleSetInactive = async (memberId: string) => {
    await patchMember(memberId, { status: "SUSPENDED" }, "Member set to inactive.");
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
    <div className="space-y-5 overflow-x-hidden pt-6 sm:pt-7">
      <AdminHeader
        title="All Members"
        subtitle="Approve members, manage access, and review points and attendance"
        actionLabel={`Pending Approvals (${pendingCount})`}
        icon={Users}
        onAddClick={() => {}}
      />

      <AdminDataTableCard
        tableLabel="Members Table"
        description="Connected to the backend for member approval, status changes, access updates, and deletion."
      >
        <AdminTableViewport>
          <AdminTableState
            loading={loading}
            error={error}
            isEmpty={!loading && !error && members.length === 0}
            loadingMessage="Loading members..."
            emptyMessage="No members found."
          >
            <Table className="admin-table">
              <TableHeader className="admin-table-head">
                <TableRow>
                  <TableHead className="admin-table-head-cell">Member</TableHead>
                  <TableHead className="admin-table-head-cell">Major / Year</TableHead>
                  <TableHead className="admin-table-head-cell">Role / Sub-Role</TableHead>
                  <TableHead className="admin-table-head-cell">Status</TableHead>
                  <TableHead className="admin-table-head-cell-right">Points</TableHead>
                  <TableHead className="admin-table-head-cell-right">Events Attended</TableHead>
                  <TableHead className="admin-table-head-cell">Joined</TableHead>
                  <TableHead className="admin-table-head-cell-last">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {members.map((member) => {
                  const isActing = actionMemberId === member.id;

                  return (
                    <TableRow key={member.id} className="admin-table-row">
                      <TableCell className="admin-table-cell">
                        <PersonIdentityCell name={member.name} email={member.email} />
                      </TableCell>

                      <TableCell className="admin-table-cell">
                        <StackedInfoCell
                          primary={member.major || "—"}
                          secondary={member.academicYear || "—"}
                        />
                      </TableCell>

                      <TableCell className="admin-table-cell">
                        <LabeledBadgeStack
                          badge={<MemberRoleBadge role={member.role} />}
                          secondary={member.subRole?.trim() || "—"}
                        />
                      </TableCell>

                      <TableCell className="admin-table-cell">
                        <MemberStatusBadge status={member.status} />
                      </TableCell>

                      <TableCell className="admin-table-cell-right">
                        {member.pointsTotal}
                      </TableCell>

                      <TableCell className="admin-table-cell-right">
                        {member.eventsAttendedCount}
                      </TableCell>

                      <TableCell className="admin-table-cell-muted">
                        {formatShortDate(member.createdAt)}
                      </TableCell>

                      <TableCell className="admin-table-cell-last">
                        <div className="flex items-center justify-end gap-2">
                          <MemberQuickStatusButton
                            status={member.status}
                            loading={isActing}
                            onApprove={() => void handleApprove(member.id)}
                            onSetInactive={() => void handleSetInactive(member.id)}
                            onReactivate={() => void handleReactivate(member.id)}
                          />
                          <ViewButton onClick={() => setViewingMember(member)} />
                          <EditButton onClick={() => handleOpenEdit(member)} />
                          <Button
                            type="button"
                            variant="logout"
                            size="sm"
                            className="h-8 rounded-lg px-2.5 text-[9px] font-black uppercase tracking-[0.15em]"
                            onClick={() => setDeletingMember(member)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </AdminTableState>
        </AdminTableViewport>
      </AdminDataTableCard>

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