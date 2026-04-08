"use client";

import * as React from "react";
import { UserMinus, UserPlus, Users, UserCheck } from "lucide-react";

import { DashboardMetricCard } from "../../_components/dashboard/DashboardMetricCard";

type MembersOverviewProps = {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  inactiveMembers: number;
};

export function MembersOverview({
  totalMembers,
  activeMembers,
  pendingMembers,
  inactiveMembers,
}: MembersOverviewProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-[1.55rem] border border-border/60 bg-white/72 shadow-master backdrop-blur-md">
      <div className="border-b border-border/60 px-5 py-4.5 sm:px-6 sm:py-5">
        <p className="ui-eyebrow text-muted-foreground">
          Overview
        </p>
        <h2 className="mt-1 text-[1.28rem] font-black tracking-tight text-foreground">
          Members Snapshot
        </h2>
        <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
          A quick overview of accounts standing.
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4 sm:p-5">
        <DashboardMetricCard
          title="Total Members"
          value={totalMembers}
          icon={<Users />}
          bgClassName="bg-slate-200"
        />

        <DashboardMetricCard
          title="Active Members"
          value={activeMembers}
          icon={<UserCheck />}
          bgClassName="bg-green-100"
        />

        <DashboardMetricCard
          title="Pending Members"
          value={pendingMembers}
          icon={<UserPlus />}
          bgClassName="bg-orange-100"
        />

        <DashboardMetricCard
          title="Inactive Members"
          value={inactiveMembers}
          icon={<UserMinus />}
          bgClassName="bg-rose-100"
        />
      </div>
    </section>
  );
}