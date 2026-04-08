"use client";

import * as React from "react";

import { AdminPageHero } from "../../_components/AdminPageHero";

type MembersPageHeroProps = {
  pendingCount: number;
};

export function MembersPageHero({ pendingCount: _pendingCount }: MembersPageHeroProps) {
  return (
    <AdminPageHero
      eyebrow="Admin Workspace"
      title="Member Management"
      subtitle="Review member standing, update account access, and handle approvals from one place."
    />
  );
}