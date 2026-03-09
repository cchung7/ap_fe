import * as React from "react";
import { AdminShell } from "./_components/AdminShell/AdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}