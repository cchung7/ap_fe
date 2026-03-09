"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useMe } from "@/hooks/useMe";
import { Button } from "@/components/ui/button";
import { DrawerMenu, type DrawerMenuItem } from "@/components/ui/DrawerMenu";
import { AdminSidebarResources } from "./AdminSidebarResources";

import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Menu,
  ArrowUpRight,
} from "lucide-react";

const navItems = [
  {
    name: "ADMIN DASHBOARD",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "VIEW ALL MEMBERS",
    href: "/admin/members",
    icon: Users,
  },
  {
    name: "VIEW ALL EVENTS",
    href: "/admin/events",
    icon: CalendarDays,
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, isAuthed, isAdmin } = useMe();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  React.useEffect(() => {
    if (loading || isLoggingOut) {
      setIsRedirecting(false);
      return;
    }

    if (!isAuthed) {
      setIsRedirecting(true);
      const next = pathname || "/admin";
      router.replace(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    if (!isAdmin) {
      setIsRedirecting(true);
      router.replace("/");
      return;
    }

    setIsRedirecting(false);
  }, [loading, isAuthed, isAdmin, isLoggingOut, router, pathname]);

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

  const mobileItems = React.useMemo<DrawerMenuItem[]>(
    () =>
      navItems.map((item) => ({
        name: item.name,
        href: item.href,
        icon: item.icon,
      })),
    []
  );

  const DesktopSidebarContent = ({ compact }: { compact: boolean }) => (
    <div className="flex h-full min-h-0 flex-col">
      {!compact && (
        <div className="flex items-center justify-between gap-3 pb-5">
          <div className="ui-title text-base text-foreground tracking-tight">
            MENU
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-secondary/20 transition-all hover:border-accent/70"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <Menu size={16} />
          </button>
        </div>
      )}

      {compact && (
        <div className="flex items-center justify-center pb-4">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border/70 bg-secondary/20 transition-all hover:border-accent/70"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <Menu size={16} />
          </button>
        </div>
      )}

      <div
        className={cn(
          "relative rounded-[2rem] border border-white/40 bg-white/30 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
          compact ? "px-2 py-3" : "p-3"
        )}
      >
        {!compact && (
          <div className="px-1 pb-2">
            <div className="ui-title text-[0.78rem] tracking-[0.18em] text-muted-foreground">
              TOOLS
            </div>
          </div>
        )}

        <div
          className={cn(
            "flex flex-col justify-start",
            compact ? "items-center gap-2" : "gap-1"
          )}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname?.startsWith(item.href));

            if (compact) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-center rounded-2xl border p-2.5 transition-all",
                    active
                      ? "border-accent/75 bg-accent/10 shadow-lg shadow-accent/10"
                      : "border-border/70 bg-background/30 hover:border-accent/70 hover:bg-secondary/30"
                  )}
                  title={item.name}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-2xl transition-colors",
                      active
                        ? "bg-accent text-white"
                        : "bg-secondary text-primary group-hover:bg-accent group-hover:text-white"
                    )}
                  >
                    <Icon size={17} />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between gap-3 rounded-[1.25rem] border px-3 py-3 transition-all",
                  active
                    ? "border-accent/45 bg-white/45"
                    : "border-transparent bg-transparent hover:border-white/40 hover:bg-white/35"
                )}
              >
                <span
                  className={cn(
                    "flex min-w-0 items-center gap-3 text-foreground transition-colors",
                    active ? "text-accent" : "group-hover:text-accent"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-colors",
                      active
                        ? "bg-accent text-white"
                        : "bg-secondary/80 text-accent group-hover:bg-accent group-hover:text-white"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <span className="ui-title text-[0.92rem] leading-tight tracking-tight">
                    {item.name}
                  </span>
                </span>

                <ArrowUpRight
                  className={cn(
                    "h-4.5 w-4.5 shrink-0 transition-all",
                    active
                      ? "translate-x-0 opacity-100 text-accent"
                      : "-translate-x-3 opacity-0 text-accent group-hover:translate-x-0 group-hover:opacity-100"
                  )}
                />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex-1 min-h-0" />

      <AdminSidebarResources compact={compact} />
    </div>
  );

  if (loading && !isLoggingOut) {
    return (
      <div className="min-h-screen bg-background px-6 pt-32">
        <div className="container mx-auto max-w-7xl">
          <div className="rounded-[2.5rem] border border-border/40 bg-card/50 p-8 shadow-master backdrop-blur-xl">
            <div className="text-sm font-semibold text-muted-foreground">
              Checking access…
            </div>
          </div>
        </div>
      </div>
    );
  }

  if ((isRedirecting || !isAuthed || !isAdmin) && !isLoggingOut) {
    return (
      <div className="min-h-screen bg-background px-6 pt-32">
        <div className="container mx-auto max-w-7xl">
          <div className="rounded-[2.5rem] border border-border/40 bg-card/50 p-8 shadow-master backdrop-blur-xl">
            <div className="text-sm font-semibold text-muted-foreground">
              Loading Data…
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sidebarW = collapsed ? "lg:pl-[112px]" : "lg:pl-[304px]";

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen border-r border-border/60 bg-primary/6 backdrop-blur-md lg:block",
          collapsed ? "w-[88px]" : "w-[248px]"
        )}
      >
        <div className="flex h-full min-h-0 flex-col px-4 pb-5 pt-20">
          <DesktopSidebarContent compact={collapsed} />
        </div>
      </aside>

      <DrawerMenu
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        title="MENU"
        srTitle="Admin Navigation"
        items={mobileItems}
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
              <Link href="/" className="flex w-full items-center justify-center">
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

      <div className={cn("min-h-screen px-5 pb-8 pt-20 sm:px-8", sidebarW)}>
        <div className="container mx-auto max-w-7xl">{children}</div>
      </div>
    </div>
  );
}