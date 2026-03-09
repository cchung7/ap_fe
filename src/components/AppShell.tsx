"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AdminTopbar } from "@/components/AdminTopbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideChrome = pathname === "/login" || pathname === "/signup";
  const isAdminRoute = pathname?.startsWith("/admin");

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      {isAdminRoute ? <AdminTopbar /> : <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}