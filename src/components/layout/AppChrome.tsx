"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/admin");

  return (
    <>
      {!hideChrome && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!hideChrome && <Footer />}
    </>
  );
}