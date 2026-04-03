"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarRange, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";

type Action = {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

const actions: Action[] = [
  {
    title: "Edit My Profile",
    description: "Update your account details, contact information, and preferences.",
    href: "/profile/edit",
    icon: <UserCog className="h-4.5 w-4.5" />,
  },
  {
    title: "Manage My Events",
    description: "Review your registrations, check-ins, and event participation.",
    href: "/profile/events",
    icon: <CalendarRange className="h-4.5 w-4.5" />,
  },
];

type ProfileQuickActionsProps = {
  className?: string;
};

export function ProfileQuickActions({
  className,
}: ProfileQuickActionsProps) {
  return (
    <section
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-[1.55rem] border border-border/60 bg-white/72 shadow-master backdrop-blur-md",
        className
      )}
    >
      <div className="border-b border-border/60 px-5 py-4.5 sm:px-6 sm:py-5">
        <p className="ui-eyebrow text-muted-foreground">Actions</p>
        <h2 className="mt-1 text-[1.28rem] font-black tracking-tight text-foreground">
          Quick Actions
        </h2>
        <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
          Go straight to the profile tools you use most.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        {actions.map((action) => (
          <Link key={action.title} href={action.href} className="block min-w-0">
            <div
              className={cn(
                "group flex min-h-[92px] min-w-0 items-center justify-between gap-4 rounded-[1.1rem] border px-4 py-4 transition-all",
                "ui-surface-silver border-transparent hover:-translate-y-0.5 hover:border-accent/35"
              )}
            >
              <span className="flex min-w-0 items-start gap-3">
                <span
                  className={cn(
                    "ui-surface-silver mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                    "text-accent transition-colors group-hover:bg-accent group-hover:text-white"
                  )}
                >
                  {action.icon}
                </span>

                <span className="min-w-0">
                  <span className="ui-title block text-[0.95rem] leading-tight tracking-tight text-foreground/90 transition-colors group-hover:text-accent">
                    {action.title}
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-relaxed text-muted-foreground">
                    {action.description}
                  </span>
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
    </section>
  );
}