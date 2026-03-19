// D:\ap_fe\src\app\admin\_components\AdminShell\AdminShell.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { DrawerMenu, type DrawerMenuItem } from "@/components/ui/DrawerMenu";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./AdminSidebar";

import {
  LayoutDashboard,
  Users,
  CalendarDays,
  BookOpen,
  LifeBuoy,
} from "lucide-react";

const adminDrawerItems: DrawerMenuItem[] = [
  { name: "ADMIN DASHBOARD", href: "/admin", icon: LayoutDashboard },
  { name: "VIEW ALL MEMBERS", href: "/admin/members", icon: Users },
  { name: "VIEW ALL EVENTS", href: "/admin/events", icon: CalendarDays },
];

const adminResourceLinks = [
  { name: "RESOURCES", href: "/admin/guide", icon: BookOpen },
  { name: "SUPPORT", href: "/admin/support", icon: LifeBuoy },
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

  const ResourceRow = ({
    name,
    href,
    icon: Icon,
  }: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => {
    const active = pathname === href || pathname?.startsWith(href);

    return (
      <Link
        href={href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "group flex items-center justify-between gap-3 rounded-[1.25rem] border px-3 py-3 transition-all",
          active
            ? "border-accent/60 bg-accent/10 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.35)]"
            : "ui-surface-brand border-transparent bg-transparent hover:border-white/40 hover:bg-white/35"
        )}
      >
        <span
          className={cn(
            "flex min-w-0 items-center gap-3 transition-colors",
            active ? "text-foreground" : "text-foreground group-hover:text-accent"
          )}
        >
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-colors",
              active
                ? "bg-accent text-white"
                : "ui-surface-silver text-accent group-hover:bg-accent group-hover:text-white"
            )}
          >
            <Icon className="h-5 w-5" />
          </span>

          <span className="ui-title text-[0.92rem] leading-tight tracking-tight">
            {name}
          </span>
        </span>

        <span
          className={cn(
            "h-4.5 w-4.5 shrink-0 text-accent transition-all",
            active
              ? "translate-x-0 opacity-100"
              : "-translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
          )}
        >
          <span className="inline-block"></span>
        </span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <DrawerMenu
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        title="MENU"
        srTitle="Admin Navigation"
        items={adminDrawerItems}
        itemsTitle="TOOLS"
        middleTitle="RESOURCES"
        middleContent={
          <>
            {adminResourceLinks.map((r) => (
              <ResourceRow
                key={r.href}
                name={r.name}
                href={r.href}
                icon={r.icon}
              />
            ))}
          </>
        }
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
                Main Website
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
            <AdminSidebar
              variant="desktop"
              compact={collapsed}
              onToggleCompact={() => setCollapsed((v) => !v)}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </div>
        </aside>

        <div className="flex-1 px-5 pb-8 pt-[72px] sm:px-8">
          <div className="container mx-auto max-w-7xl">{children}</div>
        </div>
      </div>
    </div>
  );
}