"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { DrawerMenu } from "@/components/ui/DrawerMenu";
import { Button } from "@/components/ui/button";
import { ProfileSidebar } from "./ProfileSidebar";
import { profileToolsItems } from "./profileNav";

export function ProfileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!mobileOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  React.useEffect(() => {
    const open = () => setMobileOpen(true);
    const close = () => setMobileOpen(false);
    const toggle = () => setMobileOpen((v) => !v);

    window.addEventListener("profile-sidebar-open", open);
    window.addEventListener("profile-sidebar-close", close);
    window.addEventListener("profile-sidebar-toggle", toggle);

    return () => {
      window.removeEventListener("profile-sidebar-open", open);
      window.removeEventListener("profile-sidebar-close", close);
      window.removeEventListener("profile-sidebar-toggle", toggle);
    };
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setMobileOpen(false);

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

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <DrawerMenu
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        title="MENU"
        srTitle="Profile Navigation"
        items={profileToolsItems}
        itemsTitle="TOOLS"
        bottomTitle="ACTIONS"
        bottomContent={
          <>
            <Button
              asChild
              className={cn(
                "w-full rounded-2xl px-4 py-3",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "justify-center text-center",
                "font-semibold tracking-tight"
              )}
            >
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex w-full items-center justify-center"
              >
                Home
              </Link>
            </Button>

            <Button
              type="button"
              className={cn(
                "w-full rounded-2xl px-4 py-3",
                "bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90",
                "justify-center text-center",
                "font-semibold tracking-tight"
              )}
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </>
        }
      />

      <div className="lg:flex">
        <aside
          className={cn(
            "hidden lg:block sticky top-[72px] self-start shrink-0 h-[calc(100vh-72px)] border-r border-border/60 ui-surface-brand",
            collapsed ? "w-[88px]" : "w-[248px]"
          )}
        >
          <div className="h-full overflow-hidden px-4 pb-5 pt-5">
            <ProfileSidebar
              compact={collapsed}
              onToggleCompact={() => setCollapsed((v) => !v)}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </div>
        </aside>

        <div className="flex-1 px-4 pb-7 pt-[72px] sm:px-6 lg:px-7">
          <div className="mx-auto w-full max-w-[1180px]">{children}</div>
        </div>
      </div>
    </div>
  );
}