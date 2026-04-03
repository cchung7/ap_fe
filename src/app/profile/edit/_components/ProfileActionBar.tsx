"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type ProfileActionBarProps = {
  isBusy: boolean;
  submitting: boolean;
  onBack: () => void;
};

export function ProfileActionBar({
  isBusy,
  submitting,
  onBack,
}: ProfileActionBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-4 sm:pt-5">
      <Button
        type="button"
        variant="outline"
        className="min-w-[176px] rounded-2xl border-border/60 bg-white/90 px-5 shadow-[0_8px_20px_-16px_rgba(11,18,32,0.18)] hover:border-accent/35 hover:bg-white"
        onClick={onBack}
        disabled={isBusy}
      >
        Back to Profile
      </Button>

      <Button
        type="submit"
        className="min-w-[176px] rounded-2xl bg-primary px-5 text-primary-foreground shadow-[0_16px_34px_-18px_rgba(11,45,91,0.35)] hover:bg-primary/92"
        disabled={isBusy}
      >
        {submitting ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}