"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { AdminPageHero } from "../../../_components/AdminPageHero";
import { Button } from "@/components/ui/button";
import { EventEditActionBar } from "./_components/EventEditActionBar";
import { EventEditTopActionRow } from "./_components/EventEditTopActionRow";
import { EventMetadataSection } from "./_components/EventMetadataSection";
import { EventDetailsSection } from "./_components/EventDetailsSection";
import { EventPublishingSection } from "./_components/EventPublishingSection";
import { useEditEventForm } from "./_hooks/useEditEventForm";

export default function AdminEditEventPage() {
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
  } = useEditEventForm();

  return (
    <div className="relative min-w-0 space-y-5 overflow-x-clip pt-5 pb-16 sm:space-y-6 sm:pt-6 sm:pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[22rem] bg-navy-wash opacity-80" />

      <AdminPageHero
        eyebrow="Admin Workspace"
        title="Edit Event"
        subtitle="Update event details, schedule, points, and published information."
      />

      {loading ? (
        <div className="rounded-[1.55rem] border border-border/60 bg-white/72 px-6 py-12 text-center text-sm text-muted-foreground shadow-master backdrop-blur-md">
          <div className="inline-flex items-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading event details...
          </div>
        </div>
      ) : loadError ? (
        <div className="space-y-4">
          <div className="rounded-[1.55rem] border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-700">
            {loadError}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              type="button"
              className="min-w-[176px] rounded-2xl border border-primary/10 bg-[linear-gradient(135deg,rgba(11,45,91,1)_0%,rgba(22,67,128,1)_100%)] px-5 text-primary-foreground shadow-[0_18px_38px_-20px_rgba(11,45,91,0.55)] hover:bg-[linear-gradient(135deg,rgba(10,40,82,1)_0%,rgba(18,60,116,1)_100%)]"
              onClick={onCancel}
            >
              Back to Events
            </Button>

            <Button
              type="button"
              variant="outline"
              className="min-w-[176px] rounded-2xl"
              onClick={() => void retryLoad()}
            >
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-6 sm:space-y-7">
          <EventEditTopActionRow
            isBusy={isBusy}
            isDirty={isDirty}
            submitting={submitting}
            onCancel={onCancel}
          />

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

          <EventEditActionBar
            isBusy={isBusy}
            isDirty={isDirty}
            submitting={submitting}
            onCancel={onCancel}
          />
        </form>
      )}
    </div>
  );
}