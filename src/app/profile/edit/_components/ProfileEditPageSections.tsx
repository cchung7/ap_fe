"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  PersonIdentityCell,
  formatShortDate,
  MemberRoleBadge,
  MemberStatusBadge,
} from "@/components/admin/AdminEntityUI";
import { AdminInfoItem } from "@/components/admin/AdminDetailPrimitives";
import {
  ADMIN_DIALOG_CANCEL_BUTTON_CLASSNAME,
  ADMIN_DIALOG_SAVE_BUTTON_CLASSNAME,
} from "@/components/admin/AdminDialogButtonStyles";
import type { ProfileResponseDto } from "@/components/profile/editProfile.helpers";

type ProfileRole = "ADMIN" | "MEMBER";
type ProfileStatus = "ACTIVE" | "PENDING" | "SUSPENDED";

type ProfileEditPageCardShellProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function ProfileEditPageCardShell({
  eyebrow,
  title,
  description,
  action,
  children,
}: ProfileEditPageCardShellProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-[1.55rem] border border-border/60 bg-white/72 shadow-master backdrop-blur-md">
      <div className="border-b border-border/60 px-5 py-4.5 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1.5">
            <p className="ui-eyebrow text-muted-foreground">{eyebrow}</p>
            <h2 className="text-[1.28rem] font-black tracking-tight text-foreground">
              {title}
            </h2>
            {description ? (
              <p className="max-w-2xl text-[13px] leading-6 text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>

          {action ? (
            <div className="flex flex-wrap gap-2 md:justify-end">{action}</div>
          ) : null}
        </div>
      </div>

      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function ProfileEditPageHeader({
  role,
  status,
  subRole,
}: {
  role: ProfileRole;
  status: ProfileStatus;
  subRole?: string | null;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-[1.55rem] border border-border/60 bg-white/72 shadow-master backdrop-blur-md">
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <div className="space-y-3">
          <p className="ui-eyebrow text-muted-foreground">Profile Settings</p>

          <h1 className="text-[2.2rem] font-black tracking-tight text-primary sm:text-[2.6rem] lg:text-[3rem]">
            Edit My Profile
          </h1>

          <p className="max-w-2xl text-[14px] leading-7 text-muted-foreground sm:text-[15px]">
            Update your account details and security settings from one place.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <MemberRoleBadge role={role} />
            <MemberStatusBadge status={status} />
            {subRole?.trim() ? (
              <span className="inline-flex rounded-full border border-[rgba(11,45,91,0.10)] bg-white px-3 py-1 text-[11px] font-semibold text-foreground shadow-[0_8px_20px_-16px_rgba(11,18,32,0.18)]">
                {subRole.trim()}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProfileOverviewSection({
  profile,
  role,
  status,
}: {
  profile: ProfileResponseDto | null;
  role: ProfileRole;
  status: ProfileStatus;
}) {
  return (
    <ProfileEditPageCardShell
      eyebrow="Overview"
      title="Profile Snapshot"
      description="A quick summary of your current account and academic profile."
    >
      <div className="space-y-5">
        <PersonIdentityCell
          name={profile?.name || "Member"}
          email={profile?.email || "—"}
        />

        <div className="flex flex-wrap items-center gap-2">
          <MemberRoleBadge role={role} />
          <MemberStatusBadge status={status} />
          {profile?.subRole?.trim() ? (
            <span className="inline-flex rounded-full border border-[rgba(11,45,91,0.10)] bg-white px-3 py-1 text-[11px] font-semibold text-foreground shadow-[0_8px_20px_-16px_rgba(11,18,32,0.18)]">
              {profile.subRole.trim()}
            </span>
          ) : null}
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInfoItem label="Major" value={profile?.major || "—"} />
          <AdminInfoItem
            label="Academic Year"
            value={profile?.academicYear || "—"}
          />
          <AdminInfoItem
            label="Joined"
            value={profile?.createdAt ? formatShortDate(profile.createdAt) : "—"}
          />
          <AdminInfoItem
            label="Last Updated"
            value={profile?.updatedAt ? formatShortDate(profile.updatedAt) : "—"}
          />
        </div>
      </div>
    </ProfileEditPageCardShell>
  );
}

export function ProfileEditPageFooter({
  isBusy,
  isDirty,
  submitting,
  onCancel,
}: {
  isBusy: boolean;
  isDirty: boolean;
  submitting: boolean;
  onCancel: () => void;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-[1.55rem] border border-border/60 bg-white/72 shadow-master backdrop-blur-md">
      <div className="flex flex-row flex-wrap justify-center gap-3 px-4 py-4 sm:px-5 lg:px-6">
        <Button
          type="button"
          className={ADMIN_DIALOG_CANCEL_BUTTON_CLASSNAME}
          onClick={onCancel}
          disabled={isBusy}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className={ADMIN_DIALOG_SAVE_BUTTON_CLASSNAME}
          disabled={isBusy || !isDirty}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </section>
  );
}