"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";

type EventFieldShellProps = {
  label: string;
  children: React.ReactNode;
};

export const EVENT_INPUT_CLASSNAME =
  "h-13 w-full rounded-[1.05rem] border border-[rgba(11,45,91,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(244,247,252,0.96)_100%)] px-4 text-[14px] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_24px_-18px_rgba(11,18,32,0.12)] outline-none transition placeholder:text-[12px] placeholder:text-muted-foreground/80 focus:border-accent/45 focus:ring-[3px] focus:ring-[rgba(177,18,38,0.12)]";

export const EVENT_TEXTAREA_CLASSNAME =
  "w-full resize-none rounded-[1.05rem] border border-[rgba(11,45,91,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(244,247,252,0.96)_100%)] px-4 py-3.5 text-[14px] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_24px_-18px_rgba(11,18,32,0.12)] outline-none transition placeholder:text-[12px] placeholder:text-muted-foreground/80 focus:border-accent/45 focus:ring-[3px] focus:ring-[rgba(177,18,38,0.12)]";

export function EventFieldShell({
  label,
  children,
}: EventFieldShellProps) {
  return (
    <div className="space-y-2.5">
      <Label className="ui-eyebrow pl-1 text-[11px] text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}