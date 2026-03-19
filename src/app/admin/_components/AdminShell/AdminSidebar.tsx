// D:\ap_fe\src\app\admin\_components\AdminShell\AdminSidebar.tsx
"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Globe, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { adminToolsItems, adminResourcesItems } from "./adminNav";

export type AdminSidebarVariant = "desktop" | "drawer";

type AdminSidebarProps = {
  variant: AdminSidebarVariant;
  compact: boolean;

  showHeader?: boolean;
  onToggleCompact?: () => void;

  onLogout: () => void;
  isLoggingOut?: boolean;
};

function CompactIconLink({
  href,
  icon: Icon,
  title,
  active,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center justify-center rounded-[1.15rem] border p-1.5 transition-all",
        active
          ? "border-accent/70 bg-accent/10 shadow-[0_10px_24px_-16px_rgba(0,0,0,0.3)]"
          : "ui-surface-silver border-border/70 hover:border-accent/70"
      )}
      title={title}
      aria-label={title}
    >
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-[0.95rem] transition-colors",
          active
            ? "bg-accent text-white"
            : "ui-surface-silver text-primary group-hover:bg-accent group-hover:text-white"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
    </Link>
  );
}

function StandardRow({
  name,
  href,
  icon: Icon,
  active,
}: {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  const rowClass =
    "group flex items-center justify-between gap-3 rounded-[1.05rem] border px-2.25 py-2.25 transition-all";
  const iconWrapClass =
    "flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-2xl transition-colors";
  const iconClass = "h-4 w-4";
  const labelClass = "ui-title text-[0.84rem] leading-tight tracking-tight";
  const arrowClass = "h-[0.95rem] w-[0.95rem] shrink-0 text-accent transition-all";

  return (
    <Link
      href={href}
      className={cn(
        rowClass,
        active
          ? "border-accent/45 bg-white/45"
          : "ui-surface-silver border-transparent hover:border-white/40"
      )}
    >
      <span
        className={cn(
          "flex min-w-0 items-center gap-3 transition-colors",
          active ? "text-accent" : "text-foreground group-hover:text-accent"
        )}
      >
        <span
          className={cn(
            iconWrapClass,
            active
              ? "bg-accent text-white"
              : "ui-surface-silver text-accent group-hover:bg-accent group-hover:text-white"
          )}
        >
          <Icon className={iconClass} />
        </span>

        <span className={labelClass}>{name}</span>
      </span>

      <ArrowUpRight
        className={cn(
          arrowClass,
          active
            ? "translate-x-0 opacity-100"
            : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
        )}
      />
    </Link>
  );
}

export function AdminSidebar({
  variant,
  compact,
  showHeader,
  onToggleCompact,
  onLogout,
  isLoggingOut = false,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const middleScrollRef = React.useRef<HTMLDivElement | null>(null);

  const isDesktop = variant === "desktop";
  const effectiveShowHeader =
    typeof showHeader === "boolean" ? showHeader : isDesktop;

  React.useEffect(() => {
    middleScrollRef.current?.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [pathname, compact]);

  const sectionCard = cn(
    "rounded-[1.65rem] border border-white/40 bg-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-md",
    compact ? "px-1.5 py-2" : "p-2.25"
  );

  const sectionTitle =
    "ui-title text-[0.74rem] tracking-[0.18em] text-muted-foreground";

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {effectiveShowHeader && isDesktop && (
        compact ? (
          <div className="shrink-0 flex items-center justify-center pb-3">
            <button
              type="button"
              onClick={onToggleCompact}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-secondary/20 transition-all hover:border-accent/70"
              aria-label="Expand sidebar"
              title="Expand"
            >
              <Menu size={16} />
            </button>
          </div>
        ) : (
          <div className="shrink-0 flex items-center justify-between gap-3 pb-4">
            <div className="ui-title text-base tracking-tight text-foreground">
              MENU
            </div>

            <button
              type="button"
              onClick={onToggleCompact}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-border/70 bg-secondary/20 transition-all hover:border-accent/70"
              aria-label="Collapse sidebar"
              title="Collapse"
            >
              <Menu size={16} />
            </button>
          </div>
        )
      )}

      <div
        ref={middleScrollRef}
        className="min-h-0 flex-1 overflow-y-auto pr-1"
      >
        <div className={sectionCard}>
          {!compact && (
            <div className="px-1 pb-2">
              <div className={sectionTitle}>TOOLS</div>
            </div>
          )}

          <div
            className={cn(
              "flex flex-col",
              compact ? "items-center gap-2" : "gap-2"
            )}
          >
            {adminToolsItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href));

              if (compact) {
                return (
                  <CompactIconLink
                    key={item.href}
                    href={item.href}
                    icon={Icon}
                    title={item.name}
                    active={active}
                  />
                );
              }

              return (
                <StandardRow
                  key={item.href}
                  name={item.name}
                  href={item.href}
                  icon={Icon}
                  active={active}
                />
              );
            })}
          </div>
        </div>

        <div className={compact ? "pt-2.5" : "pt-4"} />

        <div className={sectionCard}>
          {!compact && (
            <div className="px-1 pb-2">
              <div className={sectionTitle}>RESOURCES</div>
            </div>
          )}

          <div
            className={cn(
              "flex flex-col",
              compact ? "items-center gap-2" : "gap-2"
            )}
          >
            {adminResourcesItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href || pathname?.startsWith(item.href);

              if (compact) {
                return (
                  <CompactIconLink
                    key={item.href}
                    href={item.href}
                    icon={Icon}
                    title={item.name}
                    active={active}
                  />
                );
              }

              return (
                <StandardRow
                  key={item.href}
                  name={item.name}
                  href={item.href}
                  icon={Icon}
                  active={active}
                />
              );
            })}
          </div>
        </div>

        <div className="h-3" />
      </div>

      <div className="shrink-0 pt-3">
        <div className={sectionCard}>
          {!compact && (
            <div className="px-1 pb-2">
              <div className={sectionTitle}>ACTIONS</div>
            </div>
          )}

          {compact ? (
            <div className="flex flex-col items-center gap-2">
              <CompactIconLink
                href="/"
                icon={Globe}
                title="Main Website"
                active={false}
              />

              <button
                type="button"
                onClick={onLogout}
                disabled={isLoggingOut}
                className={cn(
                  "group flex items-center justify-center rounded-[1.15rem] border p-1.5 transition-all",
                  "ui-surface-silver border-border/70 hover:border-accent/70",
                  isLoggingOut && "cursor-not-allowed opacity-60"
                )}
                title={isLoggingOut ? "Logging out..." : "Logout"}
                aria-label={isLoggingOut ? "Logging out..." : "Logout"}
              >
                <div className="ui-surface-silver flex h-8 w-8 items-center justify-center rounded-[0.95rem] text-primary transition-colors group-hover:bg-accent group-hover:text-white">
                  <LogOut className="h-4 w-4" />
                </div>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                asChild
                size="sm"
                className={cn(
                  "w-full rounded-2xl px-4 py-2.5",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  "justify-center text-center",
                  "font-semibold tracking-tight text-[0.82rem]"
                )}
              >
                <Link href="/" className="flex w-full items-center justify-center">
                  Main Website
                </Link>
              </Button>

              <Button
                type="button"
                size="sm"
                className={cn(
                  "w-full rounded-2xl px-4 py-2.5",
                  "bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90",
                  "justify-center text-center",
                  "font-semibold tracking-tight text-[0.82rem]"
                )}
                onClick={onLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}