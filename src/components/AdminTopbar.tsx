// D:\ap_fe\src\components\AdminTopbar.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

import { TopbarFrame } from "@/components/shared/TopbarFrame";
import { BrandLockup } from "@/components/shared/BrandLockup";
import { cn } from "@/lib/utils";

export function AdminTopbar() {
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      window.location.href = "/";
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

  // Hamburger triggers AdminShell drawer (mobileOpen) via the window event listeners in AdminShell.tsx
  const drawerHamburger = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={() => {
        window.dispatchEvent(new Event("admin-sidebar-toggle"));
      }}
      aria-label="Open admin menu"
      title="Menu"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );

  return (
    <TopbarFrame
      disableHideOnScroll
      compactBreakpointClassName="md"
      desktopBreakpointClassName="xl"
      leftMobile={brand}
      rightMobile={drawerHamburger}
      leftCompact={brand}
      rightCompact={drawerHamburger}
      leftDesktop={brand}
      rightDesktop={desktopActions}
    />
  );
}