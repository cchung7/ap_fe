/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Shield } from "lucide-react";
import * as React from "react";
import { useRouter } from "next/navigation";

import { useMe } from "@/hooks/useMe";
import AdminHeader from "./_components/AdminHeader/AdminHeader";

export default function AdminDashboard() {
  const router = useRouter();
  const { loading, isAdmin } = useMe();

  React.useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/");
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-12 px-6">
      <div className="container max-w-7xl mx-auto space-y-8">
        <AdminHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              <motion.div
                key="admin-placeholder-main"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex items-center justify-center p-16 border-2 border-dashed border-border/40 rounded-[2.5rem] bg-secondary/5 text-center"
              >
                <div className="space-y-3">
                  <h2 className="text-2xl font-black tracking-tight">
                    Admin Workspace
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    This area will host administrative tables, forms, and
                    management tools (events, members, roles, approvals).
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              <motion.div
                key="admin-placeholder-side"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/40 rounded-[2.5rem] bg-secondary/5 text-center space-y-4"
              >
                <div className="h-20 w-20 rounded-3xl bg-background border border-border/40 flex items-center justify-center text-muted-foreground/40">
                  <Shield size={40} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">
                    Admin Context Panel
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    Select an administrative action to manage system data.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}