// D:\ap_fe\src\components\ui\DrawerMenu.tsx
"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, X, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export type DrawerMenuItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  tooltip?: React.ReactNode;
};

type DrawerMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: string;
  srTitle?: string;

  topContent?: React.ReactNode;

  items?: DrawerMenuItem[];
  itemsTitle?: string;

  middleContent?: React.ReactNode;
  middleTitle?: string;

  bottomContent?: React.ReactNode;
  bottomTitle?: string;
};

function isDrawerItemActive(pathname: string | null, href: string, disabled?: boolean) {
  if (!pathname || disabled) return false;
  if (pathname === href) return true;

  // Treat section roots as exact-match only so `/profile` does not stay active
  // on `/profile/edit`, and `/admin` does not stay active on `/admin/events`.
  if (href === "/" || href === "/admin" || href === "/profile") return false;

  return pathname.startsWith(`${href}/`) || pathname.startsWith(href);
}

function DrawerSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const hasVisibleTitle = Boolean(title && title.trim());

  return (
    <section className="rounded-[1.5rem] border border-transparent bg-transparent p-0 shadow-none backdrop-blur-none">
      {hasVisibleTitle ? (
        <div className="px-1 pb-2">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
            {title}
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

function DrawerDisabledSupportRow({
  item,
}: {
  item: DrawerMenuItem;
}) {
  const Icon = item.icon;
  const [open, setOpen] = React.useState(false);

  const content = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
            "border-border/55 bg-card text-accent"
          )}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>

        <span className="truncate text-[0.95rem] font-semibold tracking-tight text-foreground/88">
          {item.name}
        </span>
      </span>

      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/55 opacity-70" />
    </>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-disabled="true"
          aria-expanded={open}
          className={cn(
            "group flex w-full items-center justify-between gap-3 rounded-[1rem] border px-3 py-3 text-left transition-all",
            "border-border/50 bg-background/80 text-foreground",
            "cursor-not-allowed"
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
        >
          {content}
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={10}
        className="w-[min(18rem,calc(100vw-3rem))] rounded-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="space-y-2">
          <div className="ui-title text-[0.92rem] tracking-tight text-foreground">
            Support
          </div>

          <div className="space-y-1 text-[0.82rem] leading-5 text-muted-foreground">
            {typeof item.tooltip === "string" ? (
              <p>{item.tooltip}</p>
            ) : (
              item.tooltip
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function DrawerMenu({
  open,
  onOpenChange,
  title = "Menu",
  srTitle = "Navigation Menu",
  topContent,
  items = [],
  itemsTitle = "Navigation",
  middleContent,
  middleTitle = "Resources",
  bottomContent,
  bottomTitle = "Account",
}: DrawerMenuProps) {
  const pathname = usePathname();
  const renderCustom = Boolean(topContent);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                aria-describedby=""
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 240 }}
                className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-sm flex-col border-l border-border/50 bg-background/98 px-4 py-4 shadow-2xl backdrop-blur-xl"
              >
                <Dialog.Title className="sr-only">{srTitle}</Dialog.Title>

                <div className="flex items-center justify-between gap-3 border-b border-border/45 pb-3">
                  <div className="ui-title text-[1.05rem] tracking-tight text-foreground">
                    {title}
                  </div>

                  <Dialog.Close asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full border border-border/55 bg-card/70 hover:bg-secondary/70"
                    >
                      <X className="h-4.5 w-4.5" />
                    </Button>
                  </Dialog.Close>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto pt-4 pr-1">
                  {renderCustom ? (
                    <div className="min-h-full flex flex-col">{topContent}</div>
                  ) : (
                    <div className="flex min-h-full flex-col gap-4">
                      {items.length > 0 ? (
                        <DrawerSection title={itemsTitle}>
                          {items.map((item, i) => {
                            const Icon = item.icon;
                            const active = isDrawerItemActive(
                              pathname,
                              item.href,
                              item.disabled
                            );

                            if (item.disabled) {
                              return (
                                <motion.div
                                  key={`${item.name}-${item.href}`}
                                  initial={{ opacity: 0, x: 12 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.04 * i }}
                                >
                                  <DrawerDisabledSupportRow item={item} />
                                </motion.div>
                              );
                            }

                            return (
                              <motion.div
                                key={`${item.name}-${item.href}`}
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.04 * i }}
                              >
                                <Link
                                  href={item.href}
                                  onClick={() => {
                                    item.onClick?.();
                                    onOpenChange(false);
                                  }}
                                  className={cn(
                                    "group flex items-center justify-between gap-3 rounded-[1rem] border px-3 py-3 transition-all",
                                    active
                                      ? "border-accent/40 bg-accent/8 text-foreground"
                                      : "border-border/50 bg-background/80 text-foreground hover:border-accent/25 hover:bg-secondary/45"
                                  )}
                                >
                                  <span className="flex min-w-0 items-center gap-3">
                                    <span
                                      className={cn(
                                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
                                        active
                                          ? "border-accent/30 bg-accent text-white"
                                          : "border-border/55 bg-card text-accent group-hover:border-accent/25"
                                      )}
                                    >
                                      <Icon className="h-4.5 w-4.5" />
                                    </span>

                                    <span
                                      className={cn(
                                        "truncate text-[0.95rem] font-semibold tracking-tight",
                                        active
                                          ? "text-foreground"
                                          : "text-foreground/88"
                                      )}
                                    >
                                      {item.name}
                                    </span>
                                  </span>

                                  <ArrowRight
                                    className={cn(
                                      "h-4 w-4 shrink-0 transition-all",
                                      active
                                        ? "translate-x-0 text-accent opacity-100"
                                        : "translate-x-0 text-muted-foreground/55 opacity-70 group-hover:text-accent"
                                    )}
                                  />
                                </Link>
                              </motion.div>
                            );
                          })}
                        </DrawerSection>
                      ) : null}

                      {middleContent ? (
                        <DrawerSection title={middleTitle}>
                          {middleContent}
                        </DrawerSection>
                      ) : null}

                      {bottomContent ? (
                        <div className="mt-auto pt-1">
                          <DrawerSection title={bottomTitle}>
                            {bottomContent}
                          </DrawerSection>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}