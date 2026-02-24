// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Veterans Association | UT Dallas",
  description: "Student Veterans Association | UT-Dallas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} relative min-h-screen bg-background text-foreground scroll-smooth`}
      >
        <Toaster position="top-right" richColors />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}