"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

type EventEditActionBarProps = {
  isBusy: boolean;
  isDirty: boolean;
  submitting: boolean;
  onCancel: () => void;
};

export function EventEditActionBar({
  isBusy,
  isDirty,
  submitting,
  onCancel,
}: EventEditActionBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-4 sm:pt-5">
      <Button
        type="button"
        className="min-w-[176px] rounded-2xl border border-red-700/10 bg-[linear-gradient(135deg,rgba(220,38,38,1)_0%,rgba(185,28,28,1)_100%)] px-5 text-white shadow-[0_18px_38px_-20px_rgba(185,28,28,0.48)] hover:bg-[linear-gradient(135deg,rgba(185,28,28,1)_0%,rgba(153,27,27,1)_100%)]"
        onClick={onCancel}
        disabled={isBusy}
      >
        Cancel
      </Button>

      <Button
        type="submit"
        className="min-w-[176px] rounded-2xl border border-emerald-700/10 bg-[linear-gradient(135deg,rgba(22,163,74,1)_0%,rgba(21,128,61,1)_100%)] px-5 text-white shadow-[0_18px_38px_-20px_rgba(21,128,61,0.48)] hover:bg-[linear-gradient(135deg,rgba(21,128,61,1)_0%,rgba(22,101,52,1)_100%)]"
        disabled={isBusy || !isDirty}
      >
        {submitting ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}