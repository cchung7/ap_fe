// D:\ap_fe\src\app\admin\_components\dashboard\DashboardQuickActions.tsx
"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarPlus, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type Action = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const actions: Action[] = [
  {
    title: "Manage Members",
    href: "/admin/members",
    icon: <Users className="h-4.5 w-4.5" />,
  },
  {
    title: "Manage Events",
    href: "/admin/events",
    icon: <CalendarPlus className="h-4.5 w-4.5" />,
  },
];

export function DashboardQuickActions() {
  return (
    <div className="overflow-hidden rounded-[1.15rem] border border-border/70 bg-white shadow-sm">
      <div className="border-b border-border/70 px-5 py-3.5">
        <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        {actions.map((action) => (
          <Link key={action.title} href={action.href} className="block min-w-0">
            <div
              className={cn(
                "group flex min-w-0 items-center justify-between gap-3 rounded-[1.1rem] border px-3 py-3 transition-all",
                "ui-surface-silver border-transparent hover:border-accent/35 hover:-translate-y-0.5"
              )}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "ui-surface-silver flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl",
                    "text-accent transition-colors group-hover:bg-accent group-hover:text-white"
                  )}
                >
                  {action.icon}
                </span>

                <span className="ui-title truncate text-[0.92rem] leading-tight tracking-tight text-foreground/90 group-hover:text-accent transition-colors">
                  {action.title}
                </span>
              </span>

              <ArrowUpRight
                className={cn(
                  "h-4 w-4 shrink-0 text-accent transition-all",
                  "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                )}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}