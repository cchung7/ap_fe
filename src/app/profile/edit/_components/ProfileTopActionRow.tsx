"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type ProfileTopActionRowProps = {
  isBusy: boolean;
  isDirty: boolean;
  submitting: boolean;
  onBack: () => void;
};

export function ProfileTopActionRow({
  isBusy,
  isDirty,
  submitting,
  onBack,
}: ProfileTopActionRowProps) {
  return (
    <section className="rounded-[1.35rem] border border-border/60 bg-white/72 px-4 py-3 shadow-[0_14px_32px_-22px_rgba(11,18,32,0.16)] backdrop-blur-md sm:px-5 sm:py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="ui-eyebrow text-muted-foreground">Page Actions</p>
          <p className="text-[13px] leading-6 text-muted-foreground">
            Save or leave the page without scrolling to the bottom.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Button
            type="button"
            className="min-w-[152px] rounded-2xl border border-primary/10 bg-[linear-gradient(135deg,rgba(11,45,91,0.96)_0%,rgba(26,78,146,0.96)_100%)] px-4 text-primary-foreground shadow-[0_14px_30px_-18px_rgba(11,45,91,0.42)] hover:bg-[linear-gradient(135deg,rgba(10,40,82,1)_0%,rgba(22,70,132,1)_100%)]"
            onClick={onBack}
            disabled={isBusy}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="min-w-[152px] rounded-2xl border border-emerald-700/10 bg-[linear-gradient(135deg,rgba(34,197,94,0.98)_0%,rgba(22,163,74,0.98)_100%)] px-4 text-white shadow-[0_14px_30px_-18px_rgba(21,128,61,0.42)] hover:bg-[linear-gradient(135deg,rgba(22,163,74,1)_0%,rgba(21,128,61,1)_100%)]"
            disabled={isBusy || !isDirty}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </section>
  );
}