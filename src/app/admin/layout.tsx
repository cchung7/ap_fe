import * as React from "react";
import { AdminShell } from "./_components/AdminShell/AdminShell";
import { AdminTopbar } from "@/components/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminTopbar />
      <AdminShell>{children}</AdminShell>
    </>
  );
}