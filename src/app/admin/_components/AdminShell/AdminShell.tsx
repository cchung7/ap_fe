"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { DrawerMenu, type DrawerMenuItem } from "@/components/ui/DrawerMenu";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./AdminSidebar";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CircleHelp,
  Home,
  LogOut,
} from "lucide-react";

const adminDrawerItems: DrawerMenuItem[] = [
  { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "View All Members", href: "/admin/members", icon: Users },
  { name: "View All Events", href: "/admin/events", icon: CalendarDays },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
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

    window.addEventListener("admin-sidebar-open", open);
    window.addEventListener("admin-sidebar-close", close);
    window.addEventListener("admin-sidebar-toggle", toggle);

    return () => {
      window.removeEventListener("admin-sidebar-open", open);
      window.removeEventListener("admin-sidebar-close", close);
      window.removeEventListener("admin-sidebar-toggle", toggle);
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

  const SupportDisabledRow = ({
    message = "Test message",
  }: {
    message?: string;
  }) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            disabled
            aria-disabled="true"
            className={cn(
              "group flex w-full items-center justify-between gap-3 rounded-[1rem] border px-3 py-3 text-left transition-all",
              "border-border/50 bg-background/70 text-muted-foreground opacity-95",
              "cursor-not-allowed"
            )}
          >
            <span className="flex min-w-0 items-center gap-3">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                  "border-border/55 bg-card text-muted-foreground"
                )}
              >
                <CircleHelp className="h-4.5 w-4.5" />
              </span>

              <span className="truncate text-[0.95rem] font-semibold tracking-tight">
                Support
              </span>
            </span>

            <span className="text-[11px] font-semibold text-muted-foreground/80">
              Soon
            </span>
          </button>
        </TooltipTrigger>

        <TooltipContent side="top" align="start">
          {message}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#F1F5F9]">
        <DrawerMenu
          open={mobileOpen}
          onOpenChange={setMobileOpen}
          title="Menu"
          srTitle="Admin Navigation"
          items={adminDrawerItems}
          itemsTitle=""
          middleTitle=""
          middleContent={<SupportDisabledRow message="Test message" />}
          bottomTitle=""
          bottomContent={
            <>
              <Button
                asChild
                className={cn(
                  "w-full rounded-2xl px-4 py-3 font-semibold tracking-tight shadow-none",
                  "bg-primary text-primary-foreground hover:bg-primary/92"
                )}
              >
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Main Website
                </Link>
              </Button>

              <Button
                type="button"
                className={cn(
                  "w-full rounded-2xl px-4 py-3 font-semibold tracking-tight shadow-none",
                  "bg-accent text-accent-foreground hover:bg-accent/90"
                )}
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4" />
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
              <AdminSidebar
                variant="desktop"
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
    </TooltipProvider>
  );
}