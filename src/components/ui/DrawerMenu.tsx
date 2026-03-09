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
  items: DrawerMenuItem[];
  bottomContent?: React.ReactNode;
  srTitle?: string;
};

export function DrawerMenu({
  open,
  onOpenChange,
  title = "Menu",
  items,
  bottomContent,
  srTitle = "Navigation Menu",
}: DrawerMenuProps) {
  const pathname = usePathname();

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
                className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-sm flex-col border-l border-border/40 bg-background/95 p-5 shadow-2xl backdrop-blur-xl"
              >
                <Dialog.Title className="sr-only">{srTitle}</Dialog.Title>

                <div className="mb-8 flex items-center justify-between gap-3">
                  <div className="ui-title text-xl tracking-tight text-foreground">
                    {title}
                  </div>

                  <Dialog.Close asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-2xl border border-border/60 bg-secondary/20 hover:bg-secondary/30"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </Dialog.Close>
                </div>

                <div className="rounded-[2rem] border border-white/40 bg-white/30 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-md">
                  <div className="px-1 pb-2">
                    <div className="ui-title text-[0.78rem] tracking-[0.18em] text-muted-foreground">
                      TOOLS
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
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 * i }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => {
                              item.onClick?.();
                              onOpenChange(false);
                            }}
                            className={cn(
                              "group flex items-center justify-between gap-3 rounded-[1.25rem] border px-3 py-3 transition-all",
                              active
                                ? "border-accent/60 bg-accent/10 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.35)]"
                                : "border-transparent bg-transparent hover:border-white/40 hover:bg-white/35"
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
                                "h-4.5 w-4.5 shrink-0 text-accent transition-all",
                                active
                                  ? "translate-x-0 opacity-100"
                                  : "-translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                              )}
                            />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex-1" />

                {bottomContent && (
                  <>
                    <div className="px-3 pb-1 pt-6">
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/55 to-transparent" />
                    </div>

                    <div className="pt-3">
                      <div className="rounded-[2rem] border border-white/40 bg-white/30 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-md">
                        <div className="px-1 pb-2">
                          <div className="ui-title text-[0.78rem] tracking-[0.18em] text-muted-foreground">
                            ACTIONS
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">{bottomContent}</div>
                      </div>
                    </div>
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