// D:\ap_fe\src\components\home\AboutSection.tsx
"use client";

import { Separator } from "@/components/ui/separator";
import * as React from "react";
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
            {/* More top breathing room before vision block */}
            <div className="flex items-center justify-center gap-1 mb-2 sm:mb-4 md:mb-6">
              <Separator className="w-full max-w-xl bg-border/70 h-px" />
            </div>

            <div className="max-w-3xl space-y-2 text-center mx-auto pt-14 sm:pt-16">
              <p className="ui-title text-3xl md:text-4xl lg:text-5xl">
                Our Vision:
              </p>

              <div className="mt-2 mx-auto h-px w-full max-w-xl bg-border/70" />

              <p className="ui-body mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto font-medium">
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
                <div className="mx-auto w-fit flex items-start gap-[2px] text-4xl font-heading font-black tracking-tight text-foreground/90 mb-2 group-hover:text-accent transition-colors">
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
        </div>
      </div>
    </section>
  );
};