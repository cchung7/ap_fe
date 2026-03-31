"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import * as React from "react";

const slides = ["/hero/sva_1.jpg", "/hero/sva_2.jpg", "/hero/sva_3.jpg"];

export const HeroSection = () => {
  const [current, setCurrent] = React.useState(0);
  const touchStartX = React.useRef<number | null>(null);
  const touchEndX = React.useRef<number | null>(null);
  const count = slides.length;

  const goToPrevious = React.useCallback(() => {
    setCurrent((prev) => (prev === 0 ? count - 1 : prev - 1));
  }, [count]);

  const goToNext = React.useCallback(() => {
    setCurrent((prev) => (prev + 1) % count);
  }, [count]);

  React.useEffect(() => {
    if (count <= 1) return;
    const interval = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % count);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [count]);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0]?.clientX ?? null;
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.targetTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = () => {
    if (touchStartX.current == null || touchEndX.current == null) return;
    const delta = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (delta > threshold) goToNext();
    if (delta < -threshold) goToPrevious();
  };

  return (
    <section className="relative overflow-hidden bg-background pt-12 sm:pt-16 md:pt-20">
      <div
        className="ui-page-shell relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-border/50 shadow-master sm:rounded-[2.5rem]">
          <div className="relative min-h-[500px] sm:min-h-[580px] lg:min-h-[680px]">
            {slides.map((src, idx) => (
              <Image
                key={src}
                src={src}
                alt={`Hero slide ${idx + 1}`}
                fill
                priority={idx === 0}
                unoptimized
                className={cn(
                  "absolute inset-0 object-cover transition-opacity duration-1000",
                  idx === current ? "opacity-100" : "opacity-0"
                )}
                sizes="100vw"
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-r from-[#081a35]/84 via-[#081a35]/58 to-[#081a35]/18" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />

            <div className="relative z-10 flex min-h-[500px] sm:min-h-[580px] lg:min-h-[680px]">
              <div className="flex w-full flex-col justify-between px-4 py-6 sm:px-10 sm:py-12 md:px-12 lg:px-16 lg:py-16">
                <div className="mx-auto w-full rounded-[1.35rem] bg-black/30 px-8 py-4 text-center backdrop-blur-[0.01px] sm:max-w-[30rem] sm:bg-black/18 sm:p-6 md:max-w-[34rem] md:p-7 lg:mx-0 lg:max-w-4xl lg:bg-transparent lg:p-0 lg:text-left lg:backdrop-blur-0">
                  <div className="mx-auto flex w-full max-w-[15.5rem] flex-col items-center text-center sm:max-w-none sm:items-start sm:text-left">
                    <p className="ui-eyebrow text-white/50">
                      The University of Texas at Dallas
                    </p>

                    <h1 className="mt-3 font-black leading-[0.92] tracking-tight text-white sm:mt-4">
                      <span className="flex justify-center sm:hidden">
                        <span className="block text-[2.35rem] text-center">Student</span>
                      </span>
                      <span className="flex justify-center sm:hidden">
                        <span className="block text-[2.35rem] text-center">Veterans</span>
                      </span>
                      <span className="flex justify-center sm:hidden">
                        <span className="block text-[2.35rem] text-center">Association</span>
                      </span>

                      <span className="hidden sm:inline sm:text-[3.15rem] md:text-[3.75rem] lg:text-[clamp(42px,7.5vw,72px)]">
                        Student Veterans Association
                      </span>
                    </h1>

                    <p className="mt-4 max-w-[14rem] text-[0.95rem] font-medium leading-6 text-white/82 sm:max-w-[24rem] sm:text-[1.12rem] sm:leading-8 md:max-w-[28rem] md:text-[1.2rem] lg:mt-5 lg:max-w-[36rem] lg:text-[1.2rem] lg:leading-8">
                      Serving student veterans through advocacy and community support.
                    </p>
                  </div>
                </div>

                {/* Desktop / tablet CTA block */}
                <div className="mt-8 hidden sm:flex sm:flex-row sm:justify-center sm:gap-3 lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="h-[50px] rounded-full border border-white/40 bg-primary px-7 text-base font-semibold text-white shadow-sm hover:bg-primary/92 lg:h-[52px]"
                >
                  <Link href="/events">
                    Explore Events
                  </Link>
                </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-[50px] px-7 text-base font-semibold text-white !border-white/40 bg-white/10 backdrop-blur-sm hover:bg-white/18 hover:text-white lg:h-[52px] rounded-full"
                  >
                    <Link href="#contact">
                      Get Involved
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile-only CTA block */}
            <div className="absolute inset-x-0 bottom-14 z-20 flex flex-col items-center gap-2 px-4 sm:hidden">
              <Button
                asChild
                size="lg"
                className="h-[42px] w-full max-w-[13rem] rounded-full px-5 text-[0.92rem] font-semibold"
              >
                <Link href="/events">Explore Events</Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-[42px] w-full max-w-[13rem] rounded-full border-white/30 bg-white/10 px-5 text-[0.92rem] font-semibold text-white backdrop-blur-sm hover:bg-white/18 hover:text-white"
              >
                <Link href="#contact">Get Involved</Link>
              </Button>
            </div>

            {count > 1 && (
              <>
                <Button
                  type="button"
                  aria-label="Previous slide"
                  onClick={goToPrevious}
                  size="icon"
                  variant="ghost"
                  className="absolute left-3 top-[54%] z-20 h-10 w-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/12 text-white backdrop-blur-sm hover:bg-white/20 sm:left-6 sm:top-1/2 sm:h-11 sm:w-11"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                  type="button"
                  aria-label="Next slide"
                  onClick={goToNext}
                  size="icon"
                  variant="ghost"
                  className="absolute right-3 top-[54%] z-20 h-10 w-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/12 text-white backdrop-blur-sm hover:bg-white/20 sm:right-6 sm:top-1/2 sm:h-11 sm:w-11"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Go to slide ${idx + 1}`}
                      onClick={() => setCurrent(idx)}
                      className={cn(
                        "h-2.5 rounded-full transition-all",
                        idx === current ? "w-7 bg-white" : "w-2.5 bg-white/45"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};