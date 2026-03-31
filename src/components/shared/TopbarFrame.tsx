"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TopbarFrameProps = {
  leftMobile: React.ReactNode;
  rightMobile: React.ReactNode;

  leftCompact?: React.ReactNode;
  rightCompact?: React.ReactNode;

  leftDesktop: React.ReactNode;
  centerDesktop?: React.ReactNode;
  rightDesktop: React.ReactNode;

  compactBreakpointClassName?: "md";
  desktopBreakpointClassName?: "xl";

  disableHideOnScroll?: boolean;
};

export function TopbarFrame({
  leftMobile,
  rightMobile,
  leftCompact,
  rightCompact,
  leftDesktop,
  centerDesktop,
  rightDesktop,
  compactBreakpointClassName = "md",
  desktopBreakpointClassName = "xl",
}: TopbarFrameProps) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const mobileHiddenClass =
    compactBreakpointClassName === "md" ? "md:hidden" : "hidden";

  const compactVisibleClass =
    compactBreakpointClassName === "md" && desktopBreakpointClassName === "xl"
      ? "hidden md:flex xl:hidden"
      : "hidden";

  const desktopVisibleClass =
    desktopBreakpointClassName === "xl" ? "hidden xl:flex" : "hidden";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-200",
        scrolled
          ? "border-border/60 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.94),rgba(238,243,251,0.90))] shadow-[0_10px_30px_-18px_rgba(11,18,32,0.20)] backdrop-blur-xl"
          : "border-border/40 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.78),rgba(247,248,250,0.62))] shadow-[0_8px_24px_-20px_rgba(11,18,32,0.10)] backdrop-blur-lg"
      )}
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            mobileHiddenClass,
            "flex h-16 items-center justify-between gap-4"
          )}
        >
          <div className="min-w-0 flex-1">{leftMobile}</div>
          <div className="shrink-0">{rightMobile}</div>
        </div>

        <div
          className={cn(
            compactVisibleClass,
            "h-16 items-center justify-between gap-4"
          )}
        >
          <div className="min-w-0 flex-1">{leftCompact ?? leftDesktop}</div>
          <div className="shrink-0">{rightCompact ?? rightDesktop}</div>
        </div>

        <div
          className={cn(
            desktopVisibleClass,
            "h-16 items-center gap-6"
          )}
        >
          <div className="min-w-0 shrink-0">{leftDesktop}</div>

          <div className="min-w-0 flex-1">
            {centerDesktop ? (
              <div className="flex items-center justify-center">
                {centerDesktop}
              </div>
            ) : null}
          </div>

          <div className="shrink-0">
            <div className="flex items-center justify-end gap-2">
              {rightDesktop}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}