// D:\ap_fe\src\components\home\CarouselSection.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import * as React from "react";

const sponsors = [
  { src: "/backgrounds/rsm_logo.jpg", alt: "RSM" },
  { src: "/backgrounds/mvc_logo.png", alt: "MVC" },
];

export const CarouselSection = () => {
  const sponsorCount = sponsors.length;

  const [sponsorIdx, setSponsorIdx] = React.useState(0);
  const [offsetPx, setOffsetPx] = React.useState(0);

  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const [viewportPx, setViewportPx] = React.useState(720);

  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => setViewportPx(el.clientWidth);
    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Card width + gap:
  // base: w-24 (96) + gap-2 (8)  => 104
  // sm:   w-28 (112) + gap-2 (8) => 120
  // md+:  w-32 (128) + gap-2 (8) => 136
  const gapPx = 8;
  const stepPx = viewportPx >= 768 ? 136 : viewportPx >= 640 ? 120 : 104;

  const visibleCards = Math.max(1, Math.floor((viewportPx + gapPx) / stepPx));
  const maxIdx = Math.max(0, sponsorCount - visibleCards);

  const maxOffsetPx = maxIdx * stepPx;

  const shouldCenterSponsors = maxIdx === 0;

  const allowDrag = sponsorCount > 1;
  const ELASTIC_PX = 22;

  const clampOffset = React.useCallback(
    (v: number) => {
      if (maxOffsetPx > 0) return Math.min(maxOffsetPx, Math.max(0, v));

      return Math.max(-ELASTIC_PX, Math.min(ELASTIC_PX, v));
    },
    [maxOffsetPx]
  );

  React.useEffect(() => {
    setSponsorIdx((i) => Math.min(Math.max(i, 0), maxIdx));
  }, [maxIdx]);

  React.useEffect(() => {
    if (maxOffsetPx === 0) {
      setOffsetPx(0);
      return;
    }

    setOffsetPx(() => clampOffset(sponsorIdx * stepPx));
  }, [sponsorIdx, stepPx, clampOffset, maxOffsetPx]);

  const sponsorPrev = React.useCallback(() => {
    setSponsorIdx((p) => Math.max(0, p - 1));
  }, []);

  const sponsorNext = React.useCallback(() => {
    setSponsorIdx((p) => Math.min(maxIdx, p + 1));
  }, [maxIdx]);

  const isDraggingRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const startOffsetRef = React.useRef(0);
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
    if (!allowDrag) return;

    isDraggingRef.current = true;
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
    stopRaf();

    if (maxOffsetPx === 0) {
      setOffsetPx(0);
      setSponsorIdx(0);
      return;
    }

    const snapped = clampOffset(offsetPx);
    const idx = Math.round(snapped / stepPx);
    const finalIdx = Math.min(maxIdx, Math.max(0, idx));

    setSponsorIdx(finalIdx);
    setOffsetPx(clampOffset(finalIdx * stepPx));
  }, [offsetPx, stepPx, maxIdx, clampOffset, stopRaf, maxOffsetPx]);

  return (
    <section className="px-6 bg-background relative overflow-hidden">
      <div className="container max-w-6xl mx-auto">
        <div className="mt-12 text-center">
          <p className="ui-title text-3xl md:text-4xl lg:text-5xl">
            Our Sponsors:
          </p>

          <div className="mt-2 mx-auto h-px w-full max-w-xl bg-border/70" />

          <div className="mt-6 flex items-center justify-center gap-2">
            {sponsorCount > 1 && (
              <Button
                type="button"
                aria-label="Previous sponsor"
                onClick={sponsorPrev}
                size="icon"
                variant="ghost"
                disabled={sponsorIdx === 0 || shouldCenterSponsors}
                className="rounded-full border bg-background/50 backdrop-blur hover:bg-background/70 disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}

            <div
              ref={viewportRef}
              className="w-full max-w-[720px] overflow-hidden"
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
                  "gap-2",
                  shouldCenterSponsors ? "justify-center" : "justify-start",
                  allowDrag ? "cursor-grab active:cursor-grabbing select-none" : ""
                )}
                style={{
                  transform: shouldCenterSponsors
                    ? `translateX(${-offsetPx}px)`
                    : `translateX(-${offsetPx}px)`,
                }}
              >
                {sponsors.map((p) => (
                  <div key={p.src} className="shrink-0">
                    <div
                      className={cn(
                        "relative overflow-hidden",
                        "aspect-square",
                        "w-24 sm:w-28 md:w-32",
                        "rounded-xl border bg-background/60 backdrop-blur",
                        "shadow-[0_10px_30px_rgba(0,0,0,0.10)]",
                        allowDrag ? "cursor-grab active:cursor-grabbing" : ""
                      )}
                      draggable={false}
                    >
                      <Image
                        src={p.src}
                        alt={p.alt}
                        fill
                        className="object-contain p-3"
                        sizes="(max-width: 768px) 112px, 128px"
                        draggable={false}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {sponsorCount > 1 && (
              <Button
                type="button"
                aria-label="Next sponsor"
                onClick={sponsorNext}
                size="icon"
                variant="ghost"
                disabled={sponsorIdx >= maxIdx || shouldCenterSponsors}
                className="rounded-full border bg-background/50 backdrop-blur hover:bg-background/70 disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
          </div>

          {sponsorCount > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {sponsors.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to sponsor ${i + 1}`}
                  onClick={() => setSponsorIdx(i)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    i === sponsorIdx ? "bg-primary" : "bg-border"
                  )}
                />
              ))}
            </div>
          )}

          <div className="mt-10 mx-auto h-px w-full max-w-xl bg-border/70" />
        </div>
      </div>
    </section>
  );
};