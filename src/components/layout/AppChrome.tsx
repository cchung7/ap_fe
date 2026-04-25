"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const CHROME_HIDDEN_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

function shouldHideChrome(pathname: string) {
  if (pathname.startsWith("/admin")) return true;

  return CHROME_HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = shouldHideChrome(pathname);

  return (
    <>
      {!hideChrome && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!hideChrome && <Footer />}
    </>
  );
}