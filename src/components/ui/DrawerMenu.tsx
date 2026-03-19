// D:\ap_fe\src\components\ui\DrawerMenu.tsx
"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, X, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DrawerMenuItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  onClick?: () => void;
};

type DrawerMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: string;
  srTitle?: string;

  topContent?: React.ReactNode;

  // Section 1 (TOOLS)
  items?: DrawerMenuItem[];
  itemsTitle?: string;

  // Section 2 (RESOURCES)
  middleContent?: React.ReactNode;
  middleTitle?: string;

  // Section 3 (ACTIONS)
  bottomContent?: React.ReactNode;
  bottomTitle?: string;
};

export function DrawerMenu({
  open,
  onOpenChange,
  title = "Menu",
  srTitle = "Navigation Menu",

  topContent,

  items = [],
  itemsTitle = "TOOLS",

  middleContent,
  middleTitle = "RESOURCES",

  bottomContent,
  bottomTitle = "ACTIONS",
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
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                aria-describedby=""
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-sm flex-col border-l border-border/40 bg-background/95 p-4 shadow-2xl backdrop-blur-xl"
              >
                <Dialog.Title className="sr-only">{srTitle}</Dialog.Title>

                {/* Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="ui-title text-lg tracking-tight text-foreground">
                    {title}
                  </div>

                  <Dialog.Close asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-2xl border border-border/60 bg-secondary/20 hover:bg-secondary/30"
                    >
                      <X className="h-4.5 w-4.5" />
                    </Button>
                  </Dialog.Close>
                </div>

                <div className="h-4 sm:h-5" />

                {renderCustom ? (
                  // Restores bottom anchoring behavior for custom content by
                  // ensuring it receives a full-height flex context.
                  <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    <div className="min-h-full flex flex-col">{topContent}</div>
                  </div>
                ) : (
                  <>
                    <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                      {/* TOOLS */}
                      <div className="rounded-[1.75rem] border border-white/40 bg-white/30 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-md">
                        <div className="px-1 pb-2">
                          <div className="ui-title text-[0.74rem] tracking-[0.18em] text-muted-foreground">
                            {itemsTitle}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {items.map((item, i) => {
                            const Icon = item.icon;
                            const active =
                              pathname === item.href ||
                              (item.href !== "/" &&
                                item.href !== "/admin" &&
                                pathname?.startsWith(item.href)) ||
                              (item.href === "/admin" && pathname === "/admin");

                            return (
                              <motion.div
                                key={`${item.name}-${item.href}`}
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.06 * i }}
                              >
                                <Link
                                  href={item.href}
                                  onClick={() => {
                                    item.onClick?.();
                                    onOpenChange(false);
                                  }}
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
                                      active
                                        ? "text-foreground"
                                        : "text-foreground group-hover:text-accent"
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
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* RESOURCES */}
                      {middleContent ? (
                        <div className="pt-4">
                          <div className="rounded-[1.75rem] border border-white/40 bg-white/30 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-md">
                            <div className="px-1 pb-2">
                              <div className="ui-title text-[0.74rem] tracking-[0.18em] text-muted-foreground">
                                {middleTitle}
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              {middleContent}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <div className="h-4" />
                    </div>

                    {/* ACTIONS */}
                    {bottomContent ? (
                      <div className="pt-3">
                        <div className="rounded-[1.75rem] border border-white/40 bg-white/30 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-md">
                          <div className="px-1 pb-2">
                            <div className="ui-title text-[0.74rem] tracking-[0.18em] text-muted-foreground">
                              {bottomTitle}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            {bottomContent}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}