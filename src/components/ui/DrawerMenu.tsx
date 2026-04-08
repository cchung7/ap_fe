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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

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

function isDrawerItemActive(
  pathname: string | null,
  href: string,
  disabled?: boolean
) {
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

function DisclosureMessagePanel({
  title,
  message,
}: {
  title: string;
  message: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[1.35rem]">
      <div className="relative border-b border-[rgba(11,45,91,0.14)] bg-[linear-gradient(180deg,rgba(238,243,251,0.92)_0%,rgba(255,255,255,1)_100%)] px-4 py-3.5 sm:px-5">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,rgba(11,45,91,0.85)_0%,rgba(177,18,38,0.85)_100%)]" />

        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.20em] text-muted-foreground">
            Support
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h3 className="text-[1.02rem] font-black tracking-tight text-foreground">
              {title}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white px-4 py-3.5 sm:px-5">
        <div className="text-[13px] leading-5 text-muted-foreground">
          {typeof message === "string" ? <p>{message}</p> : message}
        </div>
      </div>
    </div>
  );
}

function DrawerInfoDisclosure({
  title,
  message,
  children,
}: {
  title: string;
  message: React.ReactNode;
  children: React.ReactElement;
}) {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>{children}</PopoverTrigger>
        </TooltipTrigger>

        <TooltipContent
          side="top"
          align="start"
          sideOffset={10}
          className={cn(
            "z-[95] max-w-none w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[1.35rem] p-0",
            "border-2 border-[rgba(11,45,91,0.28)] bg-white",
            "shadow-[0_32px_90px_-24px_rgba(11,18,32,0.42),0_18px_36px_-22px_rgba(11,45,91,0.30)]",
            "ring-1 ring-white"
          )}
        >
          <DisclosureMessagePanel title={title} message={message} />
        </TooltipContent>
      </Tooltip>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={10}
        className={cn(
          "z-[95] w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-[1.35rem] p-0",
          "border-2 border-[rgba(11,45,91,0.28)] bg-white",
          "shadow-[0_32px_90px_-24px_rgba(11,18,32,0.42),0_18px_36px_-22px_rgba(11,45,91,0.30)]",
          "ring-1 ring-white",
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-[1.35rem] before:border before:border-white/70 before:content-['']"
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DisclosureMessagePanel title={title} message={message} />
      </PopoverContent>
    </Popover>
  );
}

function DrawerDisabledSupportRow({
  item,
}: {
  item: DrawerMenuItem;
}) {
  const Icon = item.icon;

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
    <DrawerInfoDisclosure title={item.name} message={item.tooltip ?? ""}>
      <button
        type="button"
        aria-disabled="true"
        aria-label={item.name}
        className={cn(
          "group flex w-full items-center justify-between gap-3 rounded-[1rem] border px-3 py-3 text-left transition-all",
          "border-border/50 bg-background/80 text-foreground",
          "cursor-help"
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {content}
      </button>
    </DrawerInfoDisclosure>
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