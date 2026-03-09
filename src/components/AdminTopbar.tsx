"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/useMe";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

import { TopbarFrame } from "@/components/shared/TopbarFrame";
import { BrandLockup } from "@/components/shared/BrandLockup";
import { cn } from "@/lib/utils";

export function AdminTopbar() {
  const router = useRouter();
  const { refresh } = useMe();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      await refresh();
      router.replace("/");
      router.refresh();
    }
  };

  const brand = (
    <BrandLockup
      title={
        <div className="ui-title text-lg text-foreground tracking-tight truncate">
          ADMINISTRATIVE CONTROL BOARD
        </div>
      }
    />
  );

  const sharedTopbarButtonClass = cn(
    "h-9 rounded-full px-4",
    "justify-center text-center",
    "font-semibold tracking-tight text-sm"
  );

  const backToHomeButton = (
    <Button
      asChild
      type="button"
      size="sm"
      className={cn(
        sharedTopbarButtonClass,
        "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
    >
      <Link href="/" className="flex items-center justify-center">
        Back to Home
      </Link>
    </Button>
  );

  const logoutButton = (
    <Button
      type="button"
      size="sm"
      className={cn(
        sharedTopbarButtonClass,
        "bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
      )}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );

  const desktopActions = (
    <>
      {backToHomeButton}
      {logoutButton}
    </>
  );

  return (
    <TopbarFrame
      compactBreakpointClassName="md"
      desktopBreakpointClassName="xl"
      leftMobile={brand}
      rightMobile={
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => {
            window.dispatchEvent(new Event("admin-sidebar-toggle"));
          }}
        >
          <Menu className="h-6 w-6" />
        </Button>
      }
      leftCompact={brand}
      rightCompact={desktopActions}
      leftDesktop={brand}
      rightDesktop={desktopActions}
    />
  );
}