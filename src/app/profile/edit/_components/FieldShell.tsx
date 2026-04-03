"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";

type FieldShellProps = {
  label: string;
  children: React.ReactNode;
};

export function FieldShell({ label, children }: FieldShellProps) {
  return (
    <div className="space-y-2.5">
      <Label className="ui-eyebrow pl-1 text-[11px] text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}