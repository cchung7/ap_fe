"use client";

import * as React from "react";

type EventFormSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function EventFormSection({
  eyebrow,
  title,
  description,
  children,
}: EventFormSectionProps) {
  return (
    <section className="rounded-[1.9rem] border border-border/60 bg-white/72 p-6 shadow-master backdrop-blur-md sm:p-7">
      <div className="space-y-1.5">
        <p className="ui-eyebrow text-muted-foreground">{eyebrow}</p>
        <h2 className="text-[1.55rem] font-black tracking-tight text-foreground sm:text-[1.7rem]">
          {title}
        </h2>
        <p className="max-w-2xl text-[13px] leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="mt-7">{children}</div>
    </section>
  );
}