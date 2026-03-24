// D:\ap_fe\src\components\home\AboutSection.tsx
"use client";

import { Separator } from "@/components/ui/separator";
import * as React from "react";
import Image from "next/image";
import { AnimatedCounter } from "../shared/AnimatedCounter";

export const AboutSection = () => {
  return (
    <section
      id="about"
      className="py-2 md:py-3 px-6 bg-background relative overflow-hidden"
    >
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
          <div className="lg:col-span-12 space-y-6">
            <div className="flex items-center justify-center gap-1 mb-0 sm:mb-2 md:mb-4">
              <Separator className="w-full max-w-xl bg-border/70 h-px" />
            </div>

            <div className="max-w-3xl space-y-0 text-center mx-auto pt-14 sm:pt-16">
              <div className="flex justify-center">
                <div className="relative flex flex-col items-center pt-[7rem] sm:pt-[8rem] md:pt-[9.25rem] lg:pt-[10.5rem]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2">
                    <div className="relative h-36 w-36 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-52 lg:w-52 opacity-90">
                      <Image
                        src="/icons/eagle_icon.png"
                        alt="Vision icon"
                        fill
                        className="object-contain saturate-[0.82] contrast-[0.94] brightness-[0.98]"
                        sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 208px"
                        priority={false}
                      />
                    </div>
                  </div>

                  <p className="ui-title text-3xl md:text-4xl lg:text-5xl leading-none">
                    Our Vision:
                  </p>
                </div>
              </div>

              <div className="mt-3 mx-auto h-px w-full max-w-xl bg-border/70" />

              <p className="ui-body mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto font-medium">
                Empowering military-connected students at UT Dallas to lead with
                purpose, serve with pride, and thrive together in a resilient
                community of excellence.
              </p>

              <div className="h-2 sm:h-4 md:h-6" />
            </div>
          </div>

          <div className="lg:col-span-12 max-w-[30rem] mx-auto w-full">
            <div className="ui-surface-brand rounded-[2rem] p-5 sm:p-6">
              <div className="relative z-10">
                <div className="space-y-2 text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    At a Glance
                  </p>
                  <h2 className="text-2xl md:text-[1.65rem] font-black tracking-tight text-foreground">
                    By The Numbers
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium">
                    Demonstrating service, outreach, and community engagement.
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 lg:grid-cols-2 gap-2 min-w-0">
                  {[
                    { label: "Veterans Served", value: 120, suffix: "+" },
                    { label: "Events Held", value: 6, suffix: "+" },
                    { label: "Global Reach", value: 45, suffix: "M" },
                    { label: "Awards Earned", value: 12, suffix: "" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="ui-surface-silver p-5 sm:p-8 rounded-3xl hover:border-accent/35 transition-all duration-500 group min-w-0 text-center"
                    >
                      <div className="relative z-10 mx-auto w-fit flex items-start gap-[2px] text-4xl font-heading font-black tracking-tight text-foreground/90 mb-2 group-hover:text-accent transition-colors">
                        <AnimatedCounter value={stat.value} />
                        {stat.suffix && (
                          <span className="text-3xl leading-none translate-y-[2px]">
                            {stat.suffix}
                          </span>
                        )}
                      </div>

                      <p className="relative z-10 mx-auto max-w-[10rem] text-[9px] sm:text-[10px] font-black uppercase text-muted-foreground break-words tracking-[0.16em] sm:tracking-[0.22em]">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};