import * as React from "react";
import { ProfileTopbar } from "@/components/ProfileTopbar";
import { ProfileShell } from "./_components/ProfileShell/ProfileShell";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProfileTopbar />
      <ProfileShell>{children}</ProfileShell>
    </>
  );
}