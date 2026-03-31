"use client";

import * as React from "react";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

const stats = [
  { label: "Veterans Served", value: 120, suffix: "+" },
  { label: "Events Held", value: 6, suffix: "+" },
  { label: "Community Outreach", value: 4, suffix: "" },
  { label: "Awards Earned", value: 12, suffix: "" },
];

export const AboutSection = () => {
  return (
    <section id="about" className="ui-home-section">
      <div className="ui-page-shell">
        <div className="flex flex-col gap-10 lg:gap-12">
          {/* Row 1: Mission + Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-14">
            <div className="flex justify-center lg:justify-end lg:pl-10 xl:pl-12">
              <div className="ui-section-copy w-full max-w-2xl text-center lg:max-w-[28rem] lg:text-left">
                <p className="ui-eyebrow text-muted-foreground">
                  Our Purpose
                </p>

                <h2 className="ui-title text-[2.35rem] sm:text-[2.55rem] md:text-[2.85rem] lg:text-[3rem] xl:text-[3.2rem]">
                  Mission Statement
                </h2>

                <div className="ui-section-divider mx-auto lg:mx-0" />

                <p className="ui-section-body">
                  Empowering military-connected students and supporters through
                  advocacy, mentorship, and resources that advance academic
                  success, professional development, and community engagement.
                </p>
              </div>
            </div>

            {/* Mobile / half-width divider between Mission and Vision */}
            <div className="mx-auto my-8 block h-px w-full max-w-[12rem] bg-border/70 lg:hidden" />

            <div className="flex justify-center lg:justify-start lg:pl-8 xl:pl-10">
              <div className="ui-section-copy w-full max-w-2xl text-center lg:max-w-[28rem] lg:text-left">
                <p className="ui-eyebrow text-muted-foreground">
                  Our Focus
                </p>

                <h2 className="ui-title text-[2.35rem] sm:text-[2.55rem] md:text-[2.85rem] lg:text-[3rem] xl:text-[3.2rem]">
                  Vision Statement
                </h2>

                <div className="ui-section-divider mx-auto lg:mx-0" />

                <p className="ui-section-body">
                  Empowering military-connected students at UT Dallas to lead
                  with purpose, serve with pride, and thrive together in a
                  resilient community of excellence.
                </p>
              </div>
            </div>
          </div>

          {/* Row 2: Shared stat band */}
          <div className="ui-right-module">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="ui-surface-brand rounded-[1.75rem] px-5 py-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_18px_42px_-24px_rgba(11,18,32,0.14)] lg:px-6 lg:py-7"
                >
                  <div className="mx-auto mb-1 flex w-fit items-start gap-[2px] text-[2.2rem] font-black tracking-tight text-foreground/90 sm:text-[2.45rem] lg:text-[2.7rem]">
                    <AnimatedCounter value={stat.value} />
                    {stat.suffix && (
                      <span className="translate-y-[2px] text-[1.5rem] leading-none lg:text-[2.2rem]">
                        {stat.suffix}
                      </span>
                    )}
                  </div>

                  <p className="mx-auto max-w-[11rem] text-[10px] font-black uppercase tracking-[0.20em] text-muted-foreground sm:text-[11px] sm:tracking-[0.22em]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};