"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useMe } from "@/hooks/useMe";
import { Button } from "@/components/ui/button";

import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Settings,
  ChevronRight,
  PanelLeft,
  X,
  ArrowUpRight,
} from "lucide-react";

const navItems = [
  {
    name: "Control Panel",
    href: "/admin",
    icon: LayoutDashboard,
    subtitle: "System Overview",
  },
  {
    name: "Manage All Members",
    href: "/admin/members",
    icon: Users,
    subtitle: "Manage Members",
  },
  {
    name: "Manage All Events",
    href: "/admin/events",
    icon: CalendarDays,
    subtitle: "Manage Events",
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, isAuthed, isAdmin, refresh } = useMe();

  React.useEffect(() => {
    if (loading) return;

    if (!isAuthed) {
      const next = pathname || "/admin";
      router.replace(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    if (!isAdmin) {
      router.replace("/");
    }
  }, [loading, isAuthed, isAdmin, router, pathname]);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

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
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setMobileOpen(false);
      await refresh();
      router.replace("/");
      router.refresh();
    }
  };

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
                      {item.subtitle}
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
    </div>
  );

  if (loading || !isAuthed || !isAdmin) {
    return (
      <div className="min-h-screen bg-background pt-32 px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-xl p-8 shadow-master">
            <div className="text-sm font-semibold text-muted-foreground">
              Checking access…
            </div>
          </div>
        </div>
      </div>
    );
  }

  const SidebarW = collapsed ? "lg:pl-[96px]" : "lg:pl-[340px]";

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

      {/* Mobile Drawer */}
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <AnimatePresence>
          {mobileOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  aria-describedby=""
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 right-0 z-[60] w-full max-w-sm bg-background p-6 flex flex-col shadow-2xl border-l border-border/40 lg:hidden"
                >
                  <Dialog.Title className="sr-only">
                    Admin Navigation
                  </Dialog.Title>

                  <div className="flex items-center justify-between mb-12">
                    <div className="font-heading font-black uppercase text-xl ui-title">
                      Menu (Admin)
                    </div>

                    <Dialog.Close asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                      </Button>
                    </Dialog.Close>
                  </div>

                  <div className="flex flex-col gap-2">
                    {navItems.map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="text-3xl font-black italic tracking-tighter uppercase flex items-center justify-between group"
                          >
                            <span className="flex items-center gap-2 text-foreground group-hover:text-accent transition-colors">
                              <Icon className="h-6 w-6 text-accent" />
                              {item.name}
                            </span>
                            <ArrowUpRight className="h-6 w-6 text-accent opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="flex-1" />

                  <div className="pt-6 border-t border-border/40 space-y-3">
                    <Button
                      asChild
                      size="lg"
                      className={cn(
                        "w-full rounded-full font-black uppercase tracking-widest"
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link href="/">Back to Home</Link>
                    </Button>

                    <Button
                      type="button"
                      size="lg"
                      className={cn(
                        "w-full rounded-full font-black uppercase tracking-widest",
                        "bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
                      )}
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {/* Content area */}
      <div className={cn("pt-32 pb-12 px-6", SidebarW)}>
        <div className="container max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}