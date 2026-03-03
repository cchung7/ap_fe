// D:\ap_fe\src\components\home\AboutSection.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { AnimatedCounter } from "../shared/AnimatedCounter";

// Put your sponsor logo images in: D:\ap_fe\public\backgrounds\...
const partners = [
  { src: "/backgrounds/rsm_logo.jpg", alt: "RSM" },
  { src: "/backgrounds/mvc_logo.png", alt: "MVC" },
];

export const AboutSection = () => {
  const sponsorCount = partners.length;
  const [sponsorIdx, setSponsorIdx] = React.useState(0);

  // viewport sizing to clamp max index (no overscroll)
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

  // Card width + gap must match markup:
  // md:w-32 => 128px, gap-2 => 8px, step = 136px
  const stepPx = 136;
  const gapPx = 8;

  // number of cards that fit fully in viewport (min 1)
  const visibleCards = Math.max(1, Math.floor((viewportPx + gapPx) / stepPx));
  const maxIdx = Math.max(0, sponsorCount - visibleCards);

  // keep current index within bounds when viewport or sponsorCount changes
  React.useEffect(() => {
    setSponsorIdx((i) => Math.min(Math.max(i, 0), maxIdx));
  }, [maxIdx]);

  const sponsorPrev = React.useCallback(() => {
    setSponsorIdx((p) => Math.max(0, p - 1));
  }, []);

  const sponsorNext = React.useCallback(() => {
    setSponsorIdx((p) => Math.min(maxIdx, p + 1));
  }, [maxIdx]);

  return (
    <section
      id="about"
      className="py-8 md:py-12 px-6 bg-background relative overflow-hidden"
    >
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
          {/* Left Column - Concept */}
          <div className="lg:col-span-12 space-y-6">
            {/* More top breathing room before vision block */}
            <div className="flex items-center justify-center gap-1 mb-2 sm:mb-4 md:mb-6">
              <Separator className="w-full max-w-xl bg-border/70 h-px" />
            </div>

            <div className="max-w-3xl space-y-2 text-center mx-auto pt-14 sm:pt-16">
              <p className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                Our Vision:
              </p>

              <div className="mt-2 mx-auto h-px w-full max-w-xl bg-border/70" />

              <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto font-medium">
                Empowering military-connected students at UT Dallas to lead with
                purpose, serve with pride, and thrive together in a resilient
                community of excellence.
              </p>

              {/* Spacer so stats grid isn't glued to the text */}
              <div className="h-8 sm:h-10 md:h-12" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-2 min-w-0">
            {[
              { label: "Veterans Served", value: 120, suffix: "+" },
              { label: "Events Held", value: 6, suffix: "+" },
              { label: "Global Reach", value: 45, suffix: "M" },
              { label: "Awards Earned", value: 12, suffix: "" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-5 sm:p-8 rounded-3xl bg-secondary/30 border border-border/40 hover:border-accent/40 transition-all duration-500 group min-w-0 text-center"
              >
                <div className="mx-auto w-fit flex items-start gap-[2px] text-4xl font-heading font-black tracking-tight text-foreground mb-2 group-hover:text-accent transition-colors">
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix && (
                    <span className="text-3xl leading-none translate-y-[2px]">
                      {stat.suffix}
                    </span>
                  )}
                </div>

                <p className="mx-auto max-w-[10rem] text-[9px] sm:text-[10px] font-black uppercase text-muted-foreground break-words tracking-[0.16em] sm:tracking-[0.22em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Sponsors carousel (moved here: below stats grid, above members preview cards) */}
          <div className="lg:col-span-12">
            <div className="mt-12 text-center">
              <p className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
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
                    disabled={sponsorIdx === 0}
                    className="rounded-full border bg-background/50 backdrop-blur hover:bg-background/70 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                )}

                {/* Wider viewport so multiple logos can be visible at once */}
                <div
                  ref={viewportRef}
                  className="w-full max-w-[720px] overflow-hidden"
                >
                  <div
                    className="flex items-center gap-2 transition-transform duration-700 ease-out"
                    style={{
                      transform: `translateX(-${sponsorIdx * stepPx}px)`,
                    }}
                  >
                    {partners.map((p) => (
                      <div key={p.src} className="shrink-0">
                        <div
                          className={cn(
                            "relative overflow-hidden",
                            "aspect-square",
                            "w-24 sm:w-28 md:w-32",
                            "rounded-xl border bg-background/60 backdrop-blur",
                            "shadow-[0_10px_30px_rgba(0,0,0,0.10)]"
                          )}
                        >
                          <Image
                            src={p.src}
                            alt={p.alt}
                            fill
                            className="object-contain p-3"
                            sizes="(max-width: 768px) 112px, 128px"
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
                    disabled={sponsorIdx >= maxIdx}
                    className="rounded-full border bg-background/50 backdrop-blur hover:bg-background/70 disabled:opacity-40"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {sponsorCount > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  {partners.map((_, i) => (
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
        </div>
      </div>
    </section>
  );
};