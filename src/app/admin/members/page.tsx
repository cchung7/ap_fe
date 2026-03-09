"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import AdminHeader from "../_components/AdminHeader/AdminHeader";
import { mockAdminMembers } from "@/data/mockAdminMembers";

export default function AdminMembersPage() {
  return (
    <div className="space-y-8">
      <AdminHeader
        title="Members"
        subtitle="Manage members, roles, and point balances"
        actionLabel="New Member"
        onAddClick={() => {
          // placeholder
        }}
      />

      <AnimatePresence mode="popLayout">
        <motion.div
          key="admin-members-table"
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="overflow-hidden rounded-[2.5rem] border border-border/60 bg-secondary/10"
        >
          <div className="border-b border-border/50 p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground/70">
              Members Table (Dummy Data)
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Next we’ll add row actions: approve, adjust points, change role.
            </p>
          </div>

          <div className="overflow-x-auto p-6">
            <table className="w-full text-sm">
              <thead className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                <tr className="border-b border-border/40">
                  <th className="py-3 pr-4 text-left font-black">Name</th>
                  <th className="py-3 pr-4 text-left font-black">Email</th>
                  <th className="py-3 pr-4 text-left font-black">Role</th>
                  <th className="py-3 pr-4 text-left font-black">Status</th>
                  <th className="py-3 pl-4 text-right font-black">
                    Points Total
                  </th>
                  <th className="py-3 pl-4 text-right font-black">Pending</th>
                </tr>
              </thead>
              <tbody>
                {mockAdminMembers.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-border/30 last:border-b-0"
                  >
                    <td className="py-4 pr-4 font-bold">{m.name}</td>
                    <td className="py-4 pr-4 text-muted-foreground">
                      {m.email}
                    </td>
                    <td className="py-4 pr-4 font-black">{m.role}</td>
                    <td className="py-4 pr-4 font-black">{m.status}</td>
                    <td className="py-4 pl-4 text-right font-black">
                      {m.pointsTotal}
                    </td>
                    <td className="py-4 pl-4 text-right font-black">
                      {m.pointsPending}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}