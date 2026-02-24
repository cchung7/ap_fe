"use client";

import { Separator } from "@/components/ui/separator";
import { AnimatedCounter } from "../shared/AnimatedCounter";

export const AboutSection = () => {
  return (
    <section
      id="about"
      className="py-8 md:py-12 px-6 bg-background relative overflow-hidden"
    >
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
          {/* Left Column - Concept */}
          <div className="lg:col-span-12 space-y-6">
            <div className="flex items-center justify-center gap-1 mb-6 sm:mb-10 md:mb-14">
              <Separator className="w-8 md:w-12 bg-accent h-1" />
            </div>

            <div className="max-w-3xl space-y-2 text-center mx-auto pt-12">
              <p className="text-2xl md:text-3xl font-semibold leading-[1.2] tracking-tight text-foreground">
                Our Vision:
              </p>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto font-medium">
                Empowering military-connected students at UT Dallas to lead with
                purpose, serve with pride, and thrive together in a resilient
                community of excellence.
              </p>
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
                {/* VALUE */}
                <div className="mx-auto w-fit flex items-start gap-[2px] text-4xl font-heading font-black tracking-tight text-foreground mb-2 group-hover:text-accent transition-colors">
                  <AnimatedCounter value={stat.value} />

                  {/* SUFFIX */}
                  {stat.suffix && (
                    <span className="text-3xl leading-none translate-y-[2px]">
                      {stat.suffix}
                    </span>
                  )}
                </div>

                {/* LABEL */}
                <p className="mx-auto max-w-[10rem] text-[9px] sm:text-[10px] font-black uppercase text-muted-foreground break-words tracking-[0.16em] sm:tracking-[0.22em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};