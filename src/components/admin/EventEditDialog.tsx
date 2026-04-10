"use client";

import * as React from "react";

import {
  Dialog,
  DialogBody,
  DialogContent,
} from "@/components/ui/dialog";
import { EventMetadataSection } from "@/app/admin/events/[id]/edit/_components/EventMetadataSection";
import { EventDetailsSection } from "@/app/admin/events/[id]/edit/_components/EventDetailsSection";
import { EventPublishingSection } from "@/app/admin/events/[id]/edit/_components/EventPublishingSection";
import { useEditEventForm } from "@/app/admin/events/[id]/edit/_hooks/useEditEventForm";
import {
  EventEditDialogFooter,
  EventEditDialogHeader,
  EventEditErrorState,
  EventEditLoadingState,
} from "@/components/admin/EventEditDialogSections";

type EventEditDialogProps = {
  eventId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
};

export function EventEditDialog({
  eventId,
  open,
  onOpenChange,
  onSaved,
}: EventEditDialogProps) {
  const formRef = React.useRef<HTMLFormElement | null>(null);

  const {
    form,
    eventRecord,
    loading,
    submitting,
    loadError,
    isDirty,
    isBusy,
    setField,
    onCancel,
    onSubmit,
    retryLoad,
  } = useEditEventForm({
    eventId,
    enabled: open && !!eventId,
    onCancel: () => onOpenChange(false),
    onSuccess: () => {
      onSaved?.();
      onOpenChange(false);
    },
  });

  const handleSaveClick = React.useCallback(() => {
    if (isBusy || !isDirty || loadError || loading) return;
    formRef.current?.requestSubmit();
  }, [isBusy, isDirty, loadError, loading]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && isBusy) return;
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        className={[
          "w-[min(58rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)] overflow-hidden p-0",
          "sm:w-[min(58rem,calc(100vw-2rem))] sm:max-w-[calc(100vw-2rem)]",
          "rounded-[1.75rem] border-2 border-[rgba(11,45,91,0.28)] bg-white",
          "shadow-[0_32px_90px_-24px_rgba(11,18,32,0.42),0_18px_36px_-22px_rgba(11,45,91,0.30)]",
          "ring-1 ring-white",
        ].join(" ")}
      >
        <div className="relative flex max-h-[calc(100vh-1rem)] min-h-0 flex-col overflow-hidden rounded-[1.75rem] bg-white sm:max-h-[calc(100vh-2rem)]">
          <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] border border-white/70" />

          <EventEditDialogHeader />

          <DialogBody className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-4 py-4 sm:px-5 sm:py-5 lg:px-6">
            {loading ? (
              <EventEditLoadingState />
            ) : loadError ? (
              <EventEditErrorState
                message={loadError}
                disabled={isBusy}
                onRetry={() => void retryLoad()}
              />
            ) : (
              <form
                ref={formRef}
                onSubmit={onSubmit}
                noValidate
                className="space-y-5"
              >
                <EventMetadataSection eventRecord={eventRecord} />

                <EventDetailsSection
                  form={form}
                  isBusy={isBusy}
                  onSetField={setField}
                />

                <EventPublishingSection
                  form={form}
                  eventRecord={eventRecord}
                  isBusy={isBusy}
                  onSetField={setField}
                />
              </form>
            )}
          </DialogBody>

          <EventEditDialogFooter
            saving={submitting}
            canSave={!isBusy && isDirty && !loadError && !loading}
            onCancel={onCancel}
            onSave={handleSaveClick}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}