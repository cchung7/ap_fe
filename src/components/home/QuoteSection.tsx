"use client";

import * as React from "react";

export const QuoteSection = () => {
  return (
    <section className="pb-12 md:pb-16">
      <div className="ui-page-shell">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-4 sm:gap-6 md:gap-8">
          <div className="h-px w-12 shrink-0 bg-gradient-to-r from-transparent via-primary/35 to-accent/45 sm:w-20 md:w-28" />

          <div className="max-w-3xl text-center">
            <p className="!text-lg italic font-medium tracking-[0.01em] text-muted-foreground sm:text-[0.95rem]">
              “One person can make a difference, and everyone should try.”
            </p>

            <p className="ui-eyebrow mt-3 text-muted-foreground/80">
              — John F. Kennedy
            </p>
          </div>

          <div className="h-px w-12 shrink-0 bg-gradient-to-l from-transparent via-primary/35 to-accent/45 sm:w-20 md:w-28" />
        </div>
      </div>
    </section>
  );
};