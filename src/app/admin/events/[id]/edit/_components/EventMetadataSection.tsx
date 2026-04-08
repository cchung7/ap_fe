"use client";

import * as React from "react";

import { formatShortDate } from "@/components/admin/AdminEntityUI";
import { EventFormSection } from "./EventFormSection";
import type { AdminEvent } from "../../../_components/eventsShared";
import {
  formatEventCategory,
  getEventCheckInCode,
} from "../../../_components/eventsShared";

function SummaryTile({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-[1.15rem] border border-[rgba(11,45,91,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,247,252,0.96)_100%)] px-4 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_12px_24px_-18px_rgba(11,18,32,0.14)]">
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 break-words text-[1.05rem] font-black tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}

type EventMetadataSectionProps = {
  eventRecord: AdminEvent | null;
};

export function EventMetadataSection({
  eventRecord,
}: EventMetadataSectionProps) {
  return (
    <EventFormSection
      eyebrow="Snapshot"
      title="Event Metadata"
      description="Review key publishing details before saving changes."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryTile
          label="Check-In Code"
          value={getEventCheckInCode(eventRecord)}
        />
        <SummaryTile
          label="Created"
          value={eventRecord?.createdAt ? formatShortDate(eventRecord.createdAt) : "—"}
        />
        <SummaryTile
          label="Updated"
          value={eventRecord?.updatedAt ? formatShortDate(eventRecord.updatedAt) : "—"}
        />
        <SummaryTile
          label="Category"
          value={eventRecord?.category ? formatEventCategory(eventRecord.category) : "—"}
        />
      </div>
    </EventFormSection>
  );
}