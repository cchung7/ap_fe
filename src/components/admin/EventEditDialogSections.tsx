"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ADMIN_DIALOG_CANCEL_BUTTON_CLASSNAME,
  ADMIN_DIALOG_SAVE_BUTTON_CLASSNAME,
} from "@/components/admin/AdminDialogButtonStyles";

export function EventEditDialogHeader() {
  return (
    <DialogHeader className="relative shrink-0 overflow-hidden border-b border-[rgba(11,45,91,0.14)] bg-[linear-gradient(180deg,rgba(238,243,251,0.92)_0%,rgba(255,255,255,1)_100%)] px-4 py-4 pr-16 sm:px-5 sm:py-5 sm:pr-20 lg:px-6 lg:pr-24">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,rgba(11,45,91,0.85)_0%,rgba(177,18,38,0.85)_100%)]" />

      <div className="space-y-1.5 text-center sm:text-left">
        <p className="ui-eyebrow text-muted-foreground">Event Access</p>
        <DialogTitle className="text-[1.35rem] font-black tracking-tight text-foreground sm:text-[1.55rem]">
          Edit Event
        </DialogTitle>
        <DialogDescription className="max-w-2xl text-[13px] leading-6 text-muted-foreground">
          Update event details, schedule, capacity, points, and published information.
        </DialogDescription>
      </div>
    </DialogHeader>
  );
}

export function EventEditLoadingState() {
  return (
    <div className="rounded-[1.55rem] border border-border/60 bg-white/72 px-6 py-12 text-center text-sm text-muted-foreground shadow-master backdrop-blur-md">
      <div className="inline-flex items-center gap-3">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading event details...
      </div>
    </div>
  );
}

export function EventEditErrorState({
  message,
  disabled,
  onRetry,
}: {
  message: string;
  disabled?: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-[1.55rem] border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-700">
        {message}
      </div>

      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          className="min-w-[176px] rounded-2xl"
          onClick={onRetry}
          disabled={disabled}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}

export function EventEditDialogFooter({
  saving,
  canSave,
  onCancel,
  onSave,
}: {
  saving: boolean;
  canSave: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <DialogFooter className="shrink-0 flex-row flex-wrap justify-center gap-3 border-t border-[rgba(11,45,91,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(247,250,253,0.96)_100%)] px-4 py-4 sm:px-5 sm:justify-center lg:px-6">
      <Button
        type="button"
        className={ADMIN_DIALOG_CANCEL_BUTTON_CLASSNAME}
        onClick={onCancel}
        disabled={saving}
      >
        Cancel
      </Button>

      <Button
        type="button"
        className={ADMIN_DIALOG_SAVE_BUTTON_CLASSNAME}
        onClick={onSave}
        disabled={!canSave}
      >
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </DialogFooter>
  );
}