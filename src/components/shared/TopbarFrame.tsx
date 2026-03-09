"use client";

import * as React from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
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
  const [hidden, setHidden] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest > previous && latest > 150) setHidden(true);
    else setHidden(false);

    setScrolled(latest > 50);
  });

  const mobileHiddenClass =
    compactBreakpointClassName === "md" ? "md:hidden" : "hidden";

  const compactVisibleClass =
    compactBreakpointClassName === "md" && desktopBreakpointClassName === "xl"
      ? "hidden md:flex xl:hidden"
      : "hidden";

  const desktopVisibleClass =
    desktopBreakpointClassName === "xl" ? "hidden xl:grid" : "hidden";

  return (
    <motion.header
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-background/90 backdrop-blur-md border-b border-border/40 py-2",
        scrolled && "bg-background"
      )}
    >
      <div className="w-full px-0">
        {/* Mobile */}
        <div
          className={cn(
            mobileHiddenClass,
            "h-14 flex items-center justify-between gap-4 px-3 sm:px-4"
          )}
        >
          <div className="min-w-0">{leftMobile}</div>
          <div className="shrink-0 flex items-center justify-end">
            {rightMobile}
          </div>
        </div>

        {/* Compact tablet / mid desktop */}
        <div
          className={cn(
            compactVisibleClass,
            "h-14 items-center justify-between gap-4 px-4 lg:px-5"
          )}
        >
          <div className="min-w-0">{leftCompact ?? leftDesktop}</div>
          <div className="shrink-0 flex items-center justify-end gap-2">
            {rightCompact ?? rightDesktop}
          </div>
        </div>

        {/* Full desktop */}
        <div
          className={cn(
            desktopVisibleClass,
            "h-14 items-center gap-6 px-5 2xl:px-6",
            centerDesktop
              ? "grid-cols-[auto_minmax(0,1fr)_auto]"
              : "grid-cols-[minmax(0,1fr)_auto]"
          )}
        >
          {/* Left */}
          <div className="min-w-0 flex items-center justify-start">
            {leftDesktop}
          </div>

          {/* Center */}
          {centerDesktop ? (
            <div className="min-w-0 flex items-center justify-center">
              {centerDesktop}
            </div>
          ) : null}

          {/* Right */}
          <div className="min-w-0 flex items-center justify-end gap-2">
            {rightDesktop}
          </div>
        </div>
      </div>
    </motion.header>
  );
}