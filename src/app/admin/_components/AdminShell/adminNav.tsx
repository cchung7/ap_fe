// D:\ap_fe\src\app\admin\_components\AdminShell\adminNav.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DrawerMenuItem } from "@/components/ui/DrawerMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  BookOpen,
  LifeBuoy,
  ArrowUpRight,
} from "lucide-react";

export const adminToolsItems: DrawerMenuItem[] = [
  { name: "ADMIN DASHBOARD", href: "/admin", icon: LayoutDashboard },
  { name: "VIEW ALL MEMBERS", href: "/admin/members", icon: Users },
  { name: "VIEW ALL EVENTS", href: "/admin/events", icon: CalendarDays },
];

export const adminResourcesItems: DrawerMenuItem[] = [
  { name: "RESOURCES", href: "/admin/guide", icon: BookOpen },
  { name: "SUPPORT", href: "/admin/support", icon: LifeBuoy },
];

// DrawerMenu TOOLS row sizing (shared so RESOURCES matches TOOLS exactly)
export function AdminDrawerRow({
  item,
  onNavigate,
}: {
  item: DrawerMenuItem;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const Icon = item.icon;

  const active =
    pathname === item.href ||
    (item.href !== "/" &&
      item.href !== "/admin" &&
      pathname?.startsWith(item.href)) ||
    (item.href === "/admin" && pathname === "/admin");

  return (
    <Link
      href={item.href}
      onClick={() => onNavigate?.()}
      className={cn(
        "group flex items-center justify-between gap-3 rounded-[1.1rem] border px-2.5 py-2.5 transition-all",
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
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl transition-colors",
            active
              ? "bg-accent text-white"
              : "ui-surface-silver text-accent group-hover:bg-accent group-hover:text-white"
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>

        <span className="ui-title text-[0.88rem] leading-tight tracking-tight">
          {item.name}
        </span>
      </span>

      <ArrowUpRight
        className={cn(
          "h-4 w-4 shrink-0 text-accent transition-all",
          active
            ? "translate-x-0 opacity-100"
            : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
        )}
      />
    </Link>
  );
}

export function AdminDrawerActions({
  onMainWebsite,
  onLogout,
  isLoggingOut,
}: {
  onMainWebsite: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}) {
  return (
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
          onClick={onMainWebsite}
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
        onClick={onLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </Button>
    </>
  );
}