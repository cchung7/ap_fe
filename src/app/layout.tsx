import "./globals.css";

import type { Metadata } from "next";
import * as React from "react";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { AppChrome } from "@/components/layout/AppChrome";
import { GlobalStatusBannerProvider } from "@/components/ui/GlobalStatusBannerProvider";

export const metadata: Metadata = {
  title: "Student Veterans Association",
  description: "UT Dallas Student Veterans Association",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <GlobalStatusBannerProvider>
          <AuthProvider>
            <AppChrome>{children}</AppChrome>
          </AuthProvider>
        </GlobalStatusBannerProvider>
      </body>
    </html>
  );
}