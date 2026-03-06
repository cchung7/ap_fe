// D:\ap_fe\src\app\members\page.tsx
"use client";

import { MemberGrid } from "@/components/members/MemberGrid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import * as React from "react";

const memberSlides = [
  { src: "/members/m1.jpg", alt: "Member highlight 1" },
  { src: "/members/m2.jpg", alt: "Member highlight 2" },
  { src: "/members/m3.jpg", alt: "Member highlight 3" },
  { src: "/members/m4.jpg", alt: "Member highlight 4" },
  { src: "/members/m5.jpg", alt: "Member highlight 5" },
  { src: "/members/m6.jpg", alt: "Member highlight 6" },
];

type MemberUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  subRole?: string | null;
  status?: string | null;
  pointsTotal?: number | null;
  academicYear?: string | null;
  major?: string | null;
  profileImageUrl?: string | null;
};

export default function MembersPage() {
  const slideCount = memberSlides.length;

  const [slideIdx, setSlideIdx] = React.useState(0);
  const [offsetPx, setOffsetPx] = React.useState(0);

  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const headerRef = React.useRef<HTMLElement | null>(null);
  const [viewportPx, setViewportPx] = React.useState(900);

  const { scrollYProgress: headerScrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });

  const headerOpacity = useTransform(
    headerScrollYProgress,
    [0, 0.55],
    [1, 0]
  );
  const headerScale = useTransform(
    headerScrollYProgress,
    [0, 0.55],
    [1, 0.96]
  );

  // ---------------------------------------
  // LIVE MEMBERS (from BE)
  // ---------------------------------------
  const [users, setUsers] = React.useState<MemberUser[]>([]);
  const [loadingUsers, setLoadingUsers] = React.useState(true);

  React.useEffect(() => {
    let alive = true;

    async function runUsers() {
      try {
        setLoadingUsers(true);

        const res = await fetch("/api/users", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const json = await res.json().catch(() => ({}));
        const list = (json as any)?.data ?? (json as any)?.users ?? [];

        if (!alive) return;
        setUsers(Array.isArray(list) ? list : []);
      } catch {
        if (!alive) return;
        setUsers([]);
      } finally {
        if (!alive) return;
        setLoadingUsers(false);
      }
    }

    runUsers();

    return () => {
      alive = false;
    };
  }, []);

  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => setViewportPx(el.clientWidth);
    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // NOTE: Responsive step sizing:
  // - base: 260px card + 12px gap => 272px
  // - sm:   320px card + 16px gap => 336px
  // - md:   420px card + 16px gap => 436px
  // - lg:   520px card + 16px gap => 536px (KEEP desktop size)
  const stepPx =
    viewportPx >= 1024
      ? 536
      : viewportPx >= 768
      ? 436
      : viewportPx >= 640
      ? 336
      : 272;
  const gapPx = viewportPx >= 640 ? 16 : 12;

  const visibleCards = Math.max(1, Math.floor((viewportPx + gapPx) / stepPx));
  const maxIdx = Math.max(0, slideCount - visibleCards);

  const maxOffsetPx = maxIdx * stepPx;

  const clampOffset = React.useCallback(
    (v: number) => Math.min(maxOffsetPx, Math.max(0, v)),
    [maxOffsetPx]
  );

  React.useEffect(() => {
    setSlideIdx((i) => Math.min(Math.max(i, 0), maxIdx));
  }, [maxIdx]);

  React.useEffect(() => {
    setOffsetPx(() => {
      const next = slideIdx * stepPx;
      return clampOffset(next);
    });
  }, [slideIdx, stepPx, clampOffset]);

  const slidePrev = React.useCallback(() => {
    setSlideIdx((p) => Math.max(0, p - 1));
  }, []);

  const slideNext = React.useCallback(() => {
    setSlideIdx((p) => Math.min(maxIdx, p + 1));
  }, [maxIdx]);

  const shouldCenterSlides = maxIdx === 0;

  // Drag/swipe support (fluid, pixel-based)
  const isDraggingRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const startOffsetRef = React.useRef(0);
  const pointerIdRef = React.useRef<number | null>(null);
  const rafRef = React.useRef<number | null>(null);

  const stopRaf = React.useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => stopRaf();
  }, [stopRaf]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (shouldCenterSlides) return;

    isDraggingRef.current = true;
    pointerIdRef.current = e.pointerId;
    startXRef.current = e.clientX;
    startOffsetRef.current = offsetPx;

    try {
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    } catch {}

    stopRaf();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - startXRef.current;
    const nextOffset = clampOffset(startOffsetRef.current - dx);

    stopRaf();
    rafRef.current = requestAnimationFrame(() => {
      setOffsetPx(nextOffset);
      rafRef.current = null;
    });
  };

  const endDrag = React.useCallback(() => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    pointerIdRef.current = null;
    stopRaf();

    const snapped = clampOffset(offsetPx);
    const idx = Math.round(snapped / stepPx);
    setSlideIdx(Math.min(maxIdx, Math.max(0, idx)));
    setOffsetPx(clampOffset(idx * stepPx));
  }, [offsetPx, stepPx, maxIdx, clampOffset, stopRaf]);

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 pt-32 pb-28 md:pb-36 sm:px-6 sm:pt-36 lg:px-8 space-y-26">
        <motion.header
          ref={headerRef}
          style={{
            opacity: headerOpacity,
            scale: headerScale,
            willChange: "transform, opacity",
          }}
          className="space-y-4 text-center transform-gpu"
        >
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="
              mx-auto
              w-full
              max-w-none
              ui-title
              leading-[1.05]
              tracking-tight
              text-[#0b2d5b]/80
              [text-shadow:0_4px_12px_rgba(0,0,0,0.22)]
              text-[2.35rem]
              sm:text-5xl
              md:text-[3.2rem]
              lg:text-6xl
            "
          >
            Our Members
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="
              ui-body
              mt-4
              text-muted-foreground
              leading-relaxed
              max-w-xl
              mx-auto
              font-medium
            "
          >
            Student veterans at UT Dallas building community, supporting one
            another, and continuing a legacy of service.
          </motion.div>
        </motion.header>

        {/* Member photo carousel */}
        <div className="w-full">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {slideCount > 1 && (
              <Button
                type="button"
                aria-label="Previous photo"
                onClick={slidePrev}
                size="icon"
                variant="ghost"
                disabled={slideIdx === 0}
                className="rounded-full border bg-background/50 backdrop-blur hover:bg-background/70 disabled:opacity-40 h-9 w-9 sm:h-10 sm:w-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}

            <div
              ref={viewportRef}
              className="w-full max-w-[92vw] sm:max-w-4xl lg:max-w-5xl overflow-hidden"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={endDrag}
              style={{ touchAction: "pan-y" }}
            >
              <div
                className={cn(
                  "flex items-center ease-out",
                  isDraggingRef.current ? "" : "transition-transform duration-700",
                  gapPx === 16 ? "gap-4" : "gap-3",
                  shouldCenterSlides ? "justify-center" : "justify-start",
                  !shouldCenterSlides
                    ? "cursor-grab active:cursor-grabbing select-none"
                    : ""
                )}
                style={{
                  transform: shouldCenterSlides
                    ? "translateX(0px)"
                    : `translateX(-${offsetPx}px)`,
                }}
              >
                {memberSlides.map((s) => (
                  <div key={s.src} className="shrink-0">
                    <div
                      className={cn(
                        "relative overflow-hidden",
                        "h-[190px] xs:h-[210px] sm:h-[240px] md:h-[280px] lg:h-[320px]",
                        "w-[260px] sm:w-[320px] md:w-[420px] lg:w-[520px]",
                        "rounded-[1.5rem] sm:rounded-[2rem] border border-border/40 bg-card/50 backdrop-blur",
                        "shadow-[0_18px_45px_rgba(0,0,0,0.12)]"
                      )}
                      draggable={false}
                    >
                      <Image
                        src={s.src}
                        alt={s.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 260px, (max-width: 768px) 320px, (max-width: 1024px) 420px, 520px"
                        priority={slideIdx === 0}
                        draggable={false}
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/0"
                        aria-hidden
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {slideCount > 1 && (
              <Button
                type="button"
                aria-label="Next photo"
                onClick={slideNext}
                size="icon"
                variant="ghost"
                disabled={slideIdx >= maxIdx}
                className="rounded-full border bg-background/50 backdrop-blur hover:bg-background/70 disabled:opacity-40 h-9 w-9 sm:h-10 sm:w-10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
          </div>

          {slideCount > 1 && (
            <div className="mt-5 sm:mt-6 flex justify-center gap-2">
              {memberSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to photo ${i + 1}`}
                  onClick={() => setSlideIdx(i)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    i === slideIdx ? "bg-primary" : "bg-border"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Centered content width */}
        <div className="max-w-6xl mx-auto w-full">
          {loadingUsers ? (
            <div className="rounded-2xl border-2 border-dashed border-border/40 bg-secondary/5 p-10 text-center text-sm text-muted-foreground">
              Loading members…
            </div>
          ) : (
            <MemberGrid
              users={Array.isArray(users) ? (users as any) : ([] as any)}
            />
          )}
        </div>
      </div>
    </div>
  );
}