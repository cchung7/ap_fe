"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Table2,
  Settings,
  ChevronRight,
  PanelLeft,
  X,
  Home,
  ArrowUpRight,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Members", href: "/admin/members", icon: Users },
  { name: "Events", href: "/admin/events", icon: CalendarDays },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // mobile drawer open
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // desktop collapsed state
  const [collapsed, setCollapsed] = React.useState(false);

  // close drawer on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // lock body scroll when mobile drawer open
  React.useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // ✅ Listen for Navbar toggle (admin-only)
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

  const sidebarW = collapsed ? "lg:pl-[96px]" : "lg:pl-[340px]";

  const SidebarContent = ({ compact }: { compact: boolean }) => (
    <div className="space-y-4">
      <div className="space-y-2">
      {navItems.map((item) => {
          const active =
          pathname === item.href ||
          (item.href !== "/admin" && pathname?.startsWith(item.href));

          return (
          <Link
              key={item.href}
              href={item.href}
              className={cn(
              "group flex items-center justify-between rounded-2xl border transition-all",
              compact ? "px-3 py-3" : "px-4 py-3",
              active
                  ? "border-accent/75 bg-accent/10 shadow-lg shadow-accent/10"
                  : "border-border/70 bg-background/30 hover:border-accent/70 hover:bg-secondary/30"
              )}
              title={compact ? item.name : undefined}
          >
              <div className={cn("flex items-center gap-3", compact && "gap-0")}>
              <div
                  className={cn(
                  "h-10 w-10 rounded-2xl flex items-center justify-center transition-colors",
                  active
                      ? "bg-accent text-white"
                      : "bg-secondary text-primary group-hover:bg-accent group-hover:text-white"
                  )}
              >
                  <item.icon size={18} />
              </div>

              {!compact && (
                  <div className="leading-tight">
                  <p className="text-xs font-black uppercase tracking-widest">
                      {item.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.name === "Dashboard"
                      ? "Manage Dashboard"
                      : `Manage ${item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()}`}
                  </p>
                  </div>
              )}
              </div>

              {!compact && (
              <ChevronRight
                  size={18}
                  className={cn(
                  "opacity-40 transition-all group-hover:opacity-80 group-hover:translate-x-0.5",
                  active && "opacity-80"
                  )}
              />
              )}
          </Link>
          );
      })}
      </div>

      {!compact && (
        <div className="rounded-[2.5rem] border border-border/70 bg-secondary/10 p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center text-primary">
              <Settings size={18} />
            </div>
            <p className="text-sm font-black tracking-tight">
              Next: actions + tables
            </p>
          </div>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            We’ll add admin actions (approve members, adjust points, create
            events) and wire them into real APIs after the skeleton is stable.
          </p>
        </div>
      )}

      {!compact && (
        <div className="pt-2">
          <Link
            href="/"
            className="group flex items-center justify-between rounded-3xl border border-border/80 bg-background/30 px-5 py-4 transition-all hover:border-accent/70 hover:bg-secondary/30"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-all">
                <Home size={18} />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-black uppercase tracking-widest">
                  Back to Home
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Exit admin dashboard
                </p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 opacity-40 group-hover:opacity-80 transition-opacity" />
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block fixed left-0 top-0 h-screen border-r border-border/60 bg-background/70 backdrop-blur-xl z-40",
          collapsed ? "w-[96px]" : "w-[340px]"
        )}
      >
        <div className="pt-28 px-4">
          <div className="flex items-center justify-end pb-4">
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className="h-10 w-10 rounded-2xl border border-border/70 bg-secondary/20 flex items-center justify-center hover:border-accent/70 transition-all"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand" : "Collapse"}
            >
              <PanelLeft size={18} />
            </button>
          </div>

          <SidebarContent compact={collapsed} />
        </div>
      </aside>

      {/* Mobile Drawer (opened by Navbar button via window event) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* backdrop */}
          <button
            type="button"
            aria-label="Close admin menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* drawer */}
          <div className="absolute left-0 top-0 h-full w-[90%] max-w-[360px] bg-background border-r border-border/70 shadow-2xl">
            <div className="pt-24 px-6 pb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
                  <Table2 size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/70">
                    Admin
                  </p>
                  <p className="text-lg font-black tracking-tight">
                    Control Panel
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="h-12 w-12 rounded-2xl border border-border/70 bg-secondary/20 flex items-center justify-center hover:border-accent/70 transition-all"
                aria-label="Close admin menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 pb-10">
              <SidebarContent compact={false} />
            </div>
          </div>
        </div>
      )}

      {/* Content area: shifted on desktop to make room for fixed sidebar */}
      <div className={cn("pt-32 pb-12 px-6", sidebarW)}>
        <div className="container max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}