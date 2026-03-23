"use client";

import * as React from "react";
import { Users } from "lucide-react";

import AdminHeader from "../_components/AdminHeader/AdminHeader";
import type { AdminMemberRow } from "@/data/mockAdminMembers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ConfirmDeleteDialog,
  EditButton,
  formatMemberRole,
  formatMemberStatusLabel,
  formatShortDate,
  LabeledBadgeStack,
  MemberOverviewSections,
  MemberQuickStatusButton,
  MemberRoleBadge,
  MemberStatusBadge,
  PersonIdentityCell,
  StackedInfoCell,
  ViewButton,
} from "@/components/admin/AdminEntityUI";

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
    <div className="pt-9 space-y-6 overflow-x-hidden">
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
            <Table className="min-w-[1320px] border-separate border-spacing-0 text-[13px]">
              <TableHeader className="bg-secondary/20 text-[9px] uppercase tracking-[0.18em] text-muted-foreground/85">
                <TableRow>
                  <TableHead className="border-b border-r border-border/60 px-4 py-3 text-left font-black">Member</TableHead>
                  <TableHead className="border-b border-r border-border/60 px-4 py-3 text-left font-black">Major / Year</TableHead>
                  <TableHead className="border-b border-r border-border/60 px-4 py-3 text-left font-black">Role / Sub-Role</TableHead>
                  <TableHead className="border-b border-r border-border/60 px-4 py-3 text-left font-black">Status</TableHead>
                  <TableHead className="border-b border-r border-border/60 px-4 py-3 text-right font-black">Points</TableHead>
                  <TableHead className="border-b border-r border-border/60 px-4 py-3 text-right font-black">Events Attended</TableHead>
                  <TableHead className="border-b border-r border-border/60 px-4 py-3 text-left font-black">Joined</TableHead>
                  <TableHead className="border-b border-border/60 px-4 py-3 text-right font-black">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {members.map((member) => {
                  const isActing = actionMemberId === member.id;

                  return (
                    <TableRow key={member.id} className="bg-white/55 transition-colors hover:bg-white/82">
                      <TableCell className="border-b border-r border-border/50 px-4 py-4 align-middle">
                        <PersonIdentityCell name={member.name} email={member.email} />
                      </TableCell>

                      <TableCell className="border-b border-r border-border/50 px-4 py-4 align-middle">
                        <StackedInfoCell primary={member.major || "—"} secondary={member.academicYear || "—"} />
                      </TableCell>

                      <TableCell className="border-b border-r border-border/50 px-4 py-4 align-middle">
                        <LabeledBadgeStack
                          badge={<MemberRoleBadge role={member.role} />}
                          secondary={member.subRole?.trim() || "—"}
                        />
                      </TableCell>

                      <TableCell className="border-b border-r border-border/50 px-4 py-4 align-middle">
                        <MemberStatusBadge status={member.status} />
                      </TableCell>

                      <TableCell className="border-b border-r border-border/50 px-4 py-4 text-right align-middle font-black text-foreground">
                        {member.pointsTotal}
                      </TableCell>

                      <TableCell className="border-b border-r border-border/50 px-4 py-4 text-right align-middle font-black text-foreground">
                        {member.eventsAttendedCount}
                      </TableCell>

                      <TableCell className="border-b border-r border-border/50 px-4 py-4 align-middle text-[12px] text-muted-foreground">
                        {formatShortDate(member.createdAt)}
                      </TableCell>

                      <TableCell className="border-b border-border/50 px-4 py-4 align-middle">
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

      <Sheet open={!!viewingMember} onOpenChange={(open) => !open && setViewingMember(null)}>
        <SheetContent side="right">
          {viewingMember && (
            <>
              <SheetHeader>
                <SheetTitle>Member Overview</SheetTitle>
                <SheetDescription>
                  Review member profile, access level, points, and attendance summary.
                </SheetDescription>
              </SheetHeader>

              <MemberOverviewSections member={viewingMember} />
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="max-w-2xl">
          {editingMember && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Member Access</DialogTitle>
                <DialogDescription>
                  Modify admin-controlled member fields only.
                </DialogDescription>
              </DialogHeader>

              <DialogBody>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">Name</label>
                    <Input value={editingMember.name} readOnly />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">Email</label>
                    <Input value={editingMember.email} readOnly />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">Role</label>
                    <Select value={editRole} onValueChange={(value) => setEditRole(value as AdminMemberRow["role"])}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEMBER">Member</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">Status</label>
                    <Select value={editStatus} onValueChange={(value) => setEditStatus(value as AdminMemberRow["status"])}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="SUSPENDED">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">Sub-Role</label>
                    <Input
                      value={editSubRole}
                      onChange={(e) => setEditSubRole(e.target.value)}
                      placeholder="e.g. Treasurer"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-secondary/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                    Read-Only Profile Summary
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-semibold text-foreground">Major</p>
                      <p className="text-sm text-muted-foreground">{editingMember.major || "—"}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-foreground">Academic Year</p>
                      <p className="text-sm text-muted-foreground">{editingMember.academicYear || "—"}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-foreground">Total Points</p>
                      <p className="text-sm text-muted-foreground">{editingMember.pointsTotal}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-foreground">Events Attended</p>
                      <p className="text-sm text-muted-foreground">{editingMember.eventsAttendedCount}</p>
                    </div>
                  </div>
                </div>
              </DialogBody>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingMember(null)} disabled={savingEdit}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => void handleSaveEdit()} disabled={savingEdit}>
                  {savingEdit ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

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