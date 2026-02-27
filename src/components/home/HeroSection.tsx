"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMe } from "@/hooks/useMe";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import * as React from "react";

const slides = ["/hero/sva_1.jpg", "/hero/sva_2.jpg", "/hero/sva_3.jpg"];

export const HeroSection = () => {
  const { loading, isAuthed, isAdmin } = useMe();

  const containerRef = React.useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.55], [1, 0.96]);

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
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % count);
    }, 5000);
    return () => clearInterval(interval);
  }, [count]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToPrevious, goToNext]);

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
    <section
      ref={containerRef}
      className="relative min-h-screen w-full pt-8 sm:pt-12 md:pt-16"
    >
      <motion.div
        style={{
          opacity: heroOpacity,
          scale: heroScale,
          height: "56vh",
          minHeight: "360px",
          maxHeight: "720px",
        }}
        className="relative w-full overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative h-full w-full">
          {slides.map((src, idx) => (
            <Image
              key={src}
              src={src}
              alt={`Hero slide ${idx + 1}`}
              fill
              priority={idx === 0}
              unoptimized
              className={cn(
                "absolute inset-0 object-cover",
                "transition-opacity duration-1000 will-change-opacity",
                idx === current ? "opacity-100 z-[1]" : "opacity-0 z-0"
              )}
              sizes="100vw"
            />
          ))}

          <div className="absolute inset-0 z-[5] pointer-events-none bg-gradient-to-b from-background/10 via-background/25 to-background/95" />
          <div className="absolute inset-0 z-[5] pointer-events-none bg-gradient-to-r from-primary/35 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 z-[15]">
            <div className="w-full px-4 pb-4 sm:pb-6">
              <div className="text-center pointer-events-none">
                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={cn(
                    "mx-auto w-full max-w-none",
                    "text-4xl sm:text-5xl md:text-6xl lg:text-6xl",
                    "leading-[1.05] tracking-tight",
                    "text-[#0b2d5b]",
                    "[text-shadow:0_4px_12px_rgba(0,0,0,0.22)]"
                  )}
                >
                  Student Veterans Association (SVA)
                </motion.h1>
              </div>
            </div>
          </div>

          {count > 1 && (
            <>
              <Button
                type="button"
                aria-label="Previous slide"
                onClick={goToPrevious}
                size="icon-lg"
                variant="ghost"
                className="absolute top-1/2 -translate-y-1/2 z-30 left-5 rounded-full bg-background/35 backdrop-blur-md border border-white/20 text-primary shadow-[0_10px_30px_rgba(0,0,0,0.30)] hover:bg-background/55 hover:scale-105 active:scale-95 transition-all"
              >
                <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
              </Button>

              <Button
                type="button"
                aria-label="Next slide"
                onClick={goToNext}
                size="icon-lg"
                variant="ghost"
                className="absolute top-1/2 -translate-y-1/2 z-30 right-5 rounded-full bg-background/35 backdrop-blur-md border border-white/20 text-primary shadow-[0_10px_30px_rgba(0,0,0,0.30)] hover:bg-background/55 hover:scale-105 active:scale-95 transition-all"
              >
                <ChevronRight className="h-6 w-6 stroke-[2.5]" />
              </Button>
            </>
          )}
        </div>
      </motion.div>

      <div className="relative z-10">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="relative mt-6 sm:mt-6 md:mt-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-2xl sm:text-3xl md:text-4xl font-semibold italic text-[#E87500]"
            >
              {/* *UT-Dallas Chapter */}
            </motion.div>

            {/* Auth-aware CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="flex flex-wrap justify-center gap-3 mt-3 sm:mt-4 md:mt-5"
            >
              {loading ? null : (
                <>
                  {!isAuthed && (
                    <Button asChild size="lg" className="rounded-full">
                      <a href="/login">Log In</a>
                    </Button>
                  )}

                  {isAuthed && (
                    <Button asChild size="lg" className="rounded-full">
                      <a href="/profile">
                        View My Profile
                      </a>
                    </Button>
                  )}

                  {isAdmin && (
                    <Button asChild size="lg" className="rounded-full">
                      <a href="/admin">Admin Dashboard</a>
                    </Button>
                  )}
                </>
              )}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.26 }}
              className="mt-16 text-2xl md:text-3xl font-semibold tracking-tight"
            >
              Our Mission:
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.32 }}
              className="mt-2 text-muted-foreground text-base md:text-lg font-medium max-w-xl mx-auto"
            >
              We work to empower UT Dallas military-connected students and
              supporters through advocacy, mentorship, and resources that
              advance academic success, professional development, and community
              engagement.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};