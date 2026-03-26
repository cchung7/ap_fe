"use client";

import * as React from "react";
import { AnimatedCounter } from "../shared/AnimatedCounter";

export const AboutSection = () => {
  return (
    <section id="about" className="ui-section-shell">
      <div className="ui-page-shell">
        <div className="ui-section-grid">
          <div className="lg:col-span-5">
            <div className="ui-section-copy">
              <p className="ui-eyebrow text-muted-foreground">Our Focus</p>

              <h2 className="ui-title">Vision Statement</h2>

              <div className="ui-section-divider" />

              <p className="ui-section-body">
                Empowering military-connected students at UT Dallas to lead with
                purpose, serve with pride, and thrive together in a resilient
                community of excellence.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="ui-right-module">
              <div className="grid grid-cols-2 gap-4 lg:gap-5">
                {[
                  { label: "Veterans Served", value: 120, suffix: "+" },
                  { label: "Events Held", value: 6, suffix: "+" },
                  { label: "Community Outreach", value: 4, suffix: "" },
                  { label: "Awards Earned", value: 12, suffix: "" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.75rem] border border-border/50 bg-card/88 px-5 py-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_18px_42px_-24px_rgba(11,18,32,0.14)] lg:px-6 lg:py-7"
                  >
                    <div className="mx-auto mb-3 flex w-fit items-start gap-[2px] text-[2.2rem] font-black tracking-tight text-foreground/90 sm:text-[2.45rem] lg:text-[2.7rem]">
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
      </div>
    </section>
  );
};