"use client";

import Link from "next/link";
import * as React from "react";
import { ArrowUpRight, BookOpen, Globe, LifeBuoy } from "lucide-react";

import { cn } from "@/lib/utils";

const resources = [
  {
    name: "MAIN WEBSITE",
    href: "/",
    icon: Globe,
  },
  {
    name: "RESOURCES",
    href: "/admin/guide",
    icon: BookOpen,
  },
  {
    name: "SUPPORT",
    href: "/admin/support",
    icon: LifeBuoy,
  },
];

export function AdminSidebarResources({
  compact,
}: {
  compact: boolean;
}) {
  if (compact) {
    return (
      <div className="pt-4">
        <div className="rounded-[2rem] border border-white/40 bg-white/30 px-2 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-md">
          <div className="flex flex-col items-center gap-2">
            {resources.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-center rounded-2xl border border-border/70 bg-background/30 p-2.5 transition-all",
                    "hover:border-accent/70 hover:bg-secondary/30"
                  )}
                  title={item.name}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-2xl bg-secondary text-primary transition-colors",
                      "group-hover:bg-accent group-hover:text-white"
                    )}
                  >
                    <Icon size={17} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-5">
      <div className="rounded-[2rem] border border-white/40 bg-white/30 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-md">
        <div className="pb-2 px-1">
          <div className="ui-title text-[0.78rem] tracking-[0.18em] text-muted-foreground">
            RESOURCES
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {resources.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between gap-3 rounded-[1.25rem] border px-3 py-3 transition-all",
                  "border-transparent bg-transparent hover:border-white/40 hover:bg-white/35"
                )}
              >
                <span className="flex min-w-0 items-center gap-3 text-foreground transition-colors group-hover:text-accent">
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary/80 text-accent transition-colors",
                      "group-hover:bg-accent group-hover:text-white"
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
                    "h-4.5 w-4.5 shrink-0 text-accent transition-all",
                    "-translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  )}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}