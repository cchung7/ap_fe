"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import AdminHeader from "../_components/AdminHeader/AdminHeader";
import { mockAdminEvents } from "@/data/mockAdminEvents";

export default function AdminEventsPage() {
  return (
    <div className="space-y-8">
      <AdminHeader
        title="Events"
        subtitle="Create, publish, and track event attendance + points"
        actionLabel="Create Event"
        onAddClick={() => {
          // placeholder
        }}
      />

      <AnimatePresence mode="popLayout">
        <motion.div
          key="admin-events-table"
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="overflow-hidden rounded-[2.5rem] border border-border/60 bg-secondary/10"
        >
          <div className="border-b border-border/50 p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground/70">
              Events Table (Dummy Data)
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Next we’ll add actions: edit, publish, rotate check-in code.
            </p>
          </div>

          <div className="overflow-x-auto p-6">
            <table className="w-full text-sm">
              <thead className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                <tr className="border-b border-border/40">
                  <th className="py-3 pr-4 text-left font-black">Title</th>
                  <th className="py-3 pr-4 text-left font-black">Date</th>
                  <th className="py-3 pr-4 text-left font-black">Status</th>
                  <th className="py-3 pl-4 text-right font-black">
                    Points Award
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockAdminEvents.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-border/30 last:border-b-0"
                  >
                    <td className="py-4 pr-4 font-bold">{e.title}</td>
                    <td className="py-4 pr-4 text-muted-foreground">
                      {new Date(e.date).toLocaleString()}
                    </td>
                    <td className="py-4 pr-4 font-black">{e.status}</td>
                    <td className="py-4 pl-4 text-right font-black">
                      {e.pointsAward}
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