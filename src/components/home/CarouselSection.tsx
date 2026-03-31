"use client";

import Image from "next/image";
import * as React from "react";

const sponsors = [
  { src: "/backgrounds/rsm_logo.jpg", alt: "RSM" },
  { src: "/backgrounds/mvc_logo.png", alt: "MVC" },
];

export const CarouselSection = () => {
  return (
    <section className="ui-home-section">
      <div className="ui-page-shell">
        <div className="ui-section-grid">
          <div className="lg:col-span-5">
            <div className="flex justify-center lg:justify-end lg:pl-10 xl:pl-12">
              <div className="ui-section-copy w-full max-w-2xl text-center lg:max-w-[28rem] lg:text-left">
                <p className="ui-eyebrow text-muted-foreground">
                  Our Network
                </p>

                <h2 className="ui-title text-[2.35rem] sm:text-[2.55rem] md:text-[2.85rem] lg:text-[3rem] xl:text-[3.2rem]">
                  Partners and Sponsors
                </h2>

                <div className="ui-section-divider mx-auto lg:mx-0" />

                <p className="ui-section-body">
                  Advancing student veteran success through corporate
                  contributions, career development events, and networking
                  opportunities.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="ui-right-module">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
                {sponsors.map((sponsor) => (
                  <div
                    key={sponsor.src}
                    className="flex items-center justify-center rounded-[1.75rem] border border-border/50 bg-card/88 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_18px_42px_-24px_rgba(11,18,32,0.14)] lg:p-7"
                  >
                    <div className="relative h-20 w-full max-w-[190px] sm:h-24 sm:max-w-[230px] lg:h-24 lg:max-w-[240px]">
                      <Image
                        src={sponsor.src}
                        alt={sponsor.alt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 190px, (max-width: 1024px) 230px, 240px"
                      />
                    </div>
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