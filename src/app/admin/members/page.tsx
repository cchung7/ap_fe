"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Pencil,
  Trash2,
  Users,
  Eye,
  Shield,
  Star,
  CalendarCheck2,
  PauseCircle,
  RotateCcw,
} from "lucide-react";

import AdminHeader from "../_components/AdminHeader/AdminHeader";
import { mockAdminMembers, type AdminMemberRow } from "@/data/mockAdminMembers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DragScrollX } from "@/components/ui/DragScrollX";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function formatMemberStatusLabel(status: AdminMemberRow["status"]) {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "PENDING":
      return "Pending";
    case "SUSPENDED":
      return "Inactive";
    default:
      return status;
  }
}

function getStatusBadgeVariant(
  status: AdminMemberRow["status"]
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "PENDING":
      return "secondary";
    case "SUSPENDED":
      return "outline";
    default:
      return "outline";
  }
}

function getRoleBadgeVariant(
  role: AdminMemberRow["role"]
): "default" | "secondary" | "outline" {
  return role === "ADMIN" ? "default" : "outline";
}

function formatRoleLabel(role: AdminMemberRow["role"]) {
  return role === "ADMIN" ? "Admin" : "Member";
}

function formatDateLabel(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.trim()[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminMembersPage() {
  const [members, setMembers] = React.useState<AdminMemberRow[]>(mockAdminMembers);

  const [viewingMember, setViewingMember] = React.useState<AdminMemberRow | null>(null);
  const [editingMember, setEditingMember] = React.useState<AdminMemberRow | null>(null);
  const [deletingMember, setDeletingMember] = React.useState<AdminMemberRow | null>(null);

  const [editRole, setEditRole] = React.useState<AdminMemberRow["role"]>("MEMBER");
  const [editStatus, setEditStatus] =
    React.useState<AdminMemberRow["status"]>("ACTIVE");
  const [editSubRole, setEditSubRole] = React.useState("");

  const pendingCount = React.useMemo(
    () => members.filter((member) => member.status === "PENDING").length,
    [members]
  );

  const handleOpenEdit = (member: AdminMemberRow) => {
    setEditingMember(member);
    setEditRole(member.role);
    setEditStatus(member.status);
    setEditSubRole(member.subRole ?? "");
  };

  const handleApprove = (memberId: string) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, status: "ACTIVE" } : member
      )
    );
  };

  const handleSetInactive = (memberId: string) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, status: "SUSPENDED" } : member
      )
    );
  };

  const handleReactivate = (memberId: string) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, status: "ACTIVE" } : member
      )
    );
  };

  const handleSaveEdit = () => {
    if (!editingMember) return;

    setMembers((prev) =>
      prev.map((member) =>
        member.id === editingMember.id
          ? {
              ...member,
              role: editRole,
              status: editStatus,
              subRole: editSubRole.trim(),
            }
          : member
      )
    );

    setEditingMember(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingMember) return;

    setMembers((prev) => prev.filter((member) => member.id !== deletingMember.id));
    setDeletingMember(null);
  };

  return (
    <div className="pt-9 space-y-6 overflow-x-hidden">
      <AdminHeader
        title="All Members"
        subtitle="Approve members, manage access, and review points and attendance"
        actionLabel={`Pending Approvals (${pendingCount})`}
        icon={Users}
        onAddClick={() => {
          // placeholder: future filter/jump-to-pending action
        }}
      />

      <AnimatePresence mode="popLayout">
        <motion.div
          key="admin-members-table"
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="overflow-hidden rounded-[2.5rem] border border-border/70 bg-background/70 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.25)]"
        >
          <div className="border-b border-border/60 bg-secondary/15 px-6 py-5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground/75">
              Members Table (Dummy Data)
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Standardized admin view with approval, access control, details, and
              placeholder attendance management.
            </p>
          </div>

          <DragScrollX>
            <table className="w-full min-w-[1320px] border-separate border-spacing-0 text-[13px]">
              <thead className="bg-secondary/20 text-[9px] uppercase tracking-[0.18em] text-muted-foreground/85">
                <tr>
                  <th className="border-b border-r border-border/60 px-4 py-3 text-left font-black">
                    Member
                  </th>
                  <th className="border-b border-r border-border/60 px-4 py-3 text-left font-black">
                    Major / Year
                  </th>
                  <th className="border-b border-r border-border/60 px-4 py-3 text-left font-black">
                    Role / Sub-Role
                  </th>
                  <th className="border-b border-r border-border/60 px-4 py-3 text-left font-black">
                    Status
                  </th>
                  <th className="border-b border-r border-border/60 px-4 py-3 text-right font-black">
                    Points
                  </th>
                  <th className="border-b border-r border-border/60 px-4 py-3 text-right font-black">
                    Events Attended
                  </th>
                  <th className="border-b border-r border-border/60 px-4 py-3 text-left font-black">
                    Joined
                  </th>
                  <th className="border-b border-border/60 px-4 py-3 text-right font-black">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="bg-white/55 transition-colors hover:bg-white/82"
                  >
                    <td className="border-b border-r border-border/50 px-4 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-black text-primary">
                          {getInitials(member.name)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-bold text-foreground">
                            {member.name}
                          </p>
                          <p className="truncate text-[12px] text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="border-b border-r border-border/50 px-4 py-4 align-middle">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          {member.major || "—"}
                        </p>
                        <p className="text-[12px] text-muted-foreground">
                          {member.academicYear || "—"}
                        </p>
                      </div>
                    </td>

                    <td className="border-b border-r border-border/50 px-4 py-4 align-middle">
                      <div className="space-y-2">
                        <Badge variant={getRoleBadgeVariant(member.role)}>
                          {formatRoleLabel(member.role)}
                        </Badge>
                        <p className="text-[12px] text-muted-foreground">
                          {member.subRole?.trim() || "—"}
                        </p>
                      </div>
                    </td>

                    <td className="border-b border-r border-border/50 px-4 py-4 align-middle">
                      <Badge variant={getStatusBadgeVariant(member.status)}>
                        {formatMemberStatusLabel(member.status)}
                      </Badge>
                    </td>

                    <td className="border-b border-r border-border/50 px-4 py-4 text-right align-middle font-black text-foreground">
                      {member.pointsTotal}
                    </td>

                    <td className="border-b border-r border-border/50 px-4 py-4 text-right align-middle font-black text-foreground">
                      {member.eventsAttendedCount}
                    </td>

                    <td className="border-b border-r border-border/50 px-4 py-4 align-middle text-[12px] text-muted-foreground">
                      {formatDateLabel(member.createdAt)}
                    </td>

                    <td className="border-b border-border/50 px-4 py-4 align-middle">
                      <div className="flex items-center justify-end gap-2">
                        {member.status === "PENDING" ? (
                          <Button
                            type="button"
                            size="sm"
                            className="h-8 rounded-lg px-2.5 text-[9px] font-black uppercase tracking-[0.15em]"
                            onClick={() => handleApprove(member.id)}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Approve
                          </Button>
                        ) : member.status === "ACTIVE" ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-lg border-border/70 px-2.5 text-[9px] font-black uppercase tracking-[0.15em]"
                            onClick={() => handleSetInactive(member.id)}
                          >
                            <PauseCircle className="h-3 w-3" />
                            Set Inactive
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            className="h-8 rounded-lg px-2.5 text-[9px] font-black uppercase tracking-[0.15em]"
                            onClick={() => handleReactivate(member.id)}
                          >
                            <RotateCcw className="h-3 w-3" />
                            Reactivate
                          </Button>
                        )}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg border-border/70 px-2.5 text-[9px] font-black uppercase tracking-[0.15em]"
                          onClick={() => setViewingMember(member)}
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg border-border/70 px-2.5 text-[9px] font-black uppercase tracking-[0.15em]"
                          onClick={() => handleOpenEdit(member)}
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </Button>

                        <Button
                          type="button"
                          variant="logout"
                          size="sm"
                          className="h-8 rounded-lg px-2.5 text-[9px] font-black uppercase tracking-[0.15em]"
                          onClick={() => setDeletingMember(member)}
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DragScrollX>
        </motion.div>
      </AnimatePresence>

      <Dialog open={!!viewingMember} onOpenChange={(open) => !open && setViewingMember(null)}>
        <DialogContent className="max-w-4xl">
          {viewingMember && (
            <>
              <DialogHeader>
                <DialogTitle>Member Overview</DialogTitle>
                <DialogDescription>
                  Review member profile, access level, points, and attendance summary.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-secondary/10 p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 font-black text-primary">
                      {getInitials(viewingMember.name)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{viewingMember.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {viewingMember.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                        Major
                      </p>
                      <p className="mt-1 font-medium text-foreground">
                        {viewingMember.major || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                        Academic Year
                      </p>
                      <p className="mt-1 font-medium text-foreground">
                        {viewingMember.academicYear || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                        Joined
                      </p>
                      <p className="mt-1 font-medium text-foreground">
                        {formatDateLabel(viewingMember.createdAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                        Last Updated
                      </p>
                      <p className="mt-1 font-medium text-foreground">
                        {formatDateLabel(viewingMember.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border/60 bg-secondary/10 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-foreground">
                        Access Management
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                          Role
                        </p>
                        <div className="mt-1">
                          <Badge variant={getRoleBadgeVariant(viewingMember.role)}>
                            {formatRoleLabel(viewingMember.role)}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                          Status
                        </p>
                        <div className="mt-1">
                          <Badge variant={getStatusBadgeVariant(viewingMember.status)}>
                            {formatMemberStatusLabel(viewingMember.status)}
                          </Badge>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                          Sub-Role
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {viewingMember.subRole?.trim() || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-secondary/10 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4 text-primary" />
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-foreground">
                        Points Summary
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-border/50 bg-background/70 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                          Total Points
                        </p>
                        <p className="mt-2 text-2xl font-black text-foreground">
                          {viewingMember.pointsTotal}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border/50 bg-background/70 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                          Events Attended
                        </p>
                        <p className="mt-2 text-2xl font-black text-foreground">
                          {viewingMember.eventsAttendedCount}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-secondary/10 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <CalendarCheck2 className="h-4 w-4 text-primary" />
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-foreground">
                        Attendance History
                      </p>
                    </div>

                    <div className="space-y-2">
                      {viewingMember.attendancePreview.length > 0 ? (
                        viewingMember.attendancePreview.map((entry) => (
                          <div
                            key={`${viewingMember.id}-${entry.eventId}`}
                            className="rounded-2xl border border-border/50 bg-background/70 px-4 py-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-foreground">
                                  {entry.title}
                                </p>
                                <p className="mt-1 text-[12px] text-muted-foreground">
                                  {entry.dateLabel} · {entry.statusLabel}
                                </p>
                              </div>
                              <p className="shrink-0 text-[12px] font-black text-foreground">
                                +{entry.pointsAwarded}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-border/60 bg-background/50 px-4 py-6 text-center text-sm text-muted-foreground">
                          No attendance records available yet.
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                      >
                        Manage Attendance
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                      >
                        Adjust Points
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setViewingMember(null);
                  }}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

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

              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                      Name
                    </label>
                    <Input value={editingMember.name} readOnly />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                      Email
                    </label>
                    <Input value={editingMember.email} readOnly />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                      Role
                    </label>
                    <Select
                      value={editRole}
                      onValueChange={(value) =>
                        setEditRole(value as AdminMemberRow["role"])
                      }
                    >
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
                    <label className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                      Status
                    </label>
                    <Select
                      value={editStatus}
                      onValueChange={(value) =>
                        setEditStatus(value as AdminMemberRow["status"])
                      }
                    >
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
                    <label className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                      Sub-Role
                    </label>
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
                      <p className="text-[11px] font-semibold text-foreground">
                        Major
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {editingMember.major || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-foreground">
                        Academic Year
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {editingMember.academicYear || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-foreground">
                        Total Points
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {editingMember.pointsTotal}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-foreground">
                        Events Attended
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {editingMember.eventsAttendedCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingMember(null)}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingMember} onOpenChange={(open) => !open && setDeletingMember(null)}>
        <DialogContent className="max-w-lg">
          {deletingMember && (
            <>
              <DialogHeader>
                <DialogTitle>Delete Member</DialogTitle>
                <DialogDescription>
                  This will permanently delete the member account. This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-4">
                <p className="font-semibold text-foreground">{deletingMember.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {deletingMember.email}
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeletingMember(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleConfirmDelete}
                >
                  Permanently Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}