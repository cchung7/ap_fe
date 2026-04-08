"use client";

import * as React from "react";
import { Ticket } from "lucide-react";

import { Input } from "@/components/ui/input";
import { EventFormSection } from "./EventFormSection";
import {
  EventFieldShell,
  EVENT_INPUT_CLASSNAME,
  EVENT_TEXTAREA_CLASSNAME,
} from "./EventFieldShell";
import type {
  AdminEvent,
  UpdateEventPayload,
} from "../../../_components/eventsShared";
import { getEventCheckInCode } from "../../../_components/eventsShared";

type EventPublishingSectionProps = {
  form: UpdateEventPayload;
  eventRecord: AdminEvent | null;
  isBusy: boolean;
  onSetField: <K extends keyof UpdateEventPayload>(
    field: K,
    value: UpdateEventPayload[K]
  ) => void;
};

export function EventPublishingSection({
  form,
  eventRecord,
  isBusy,
  onSetField,
}: EventPublishingSectionProps) {
  return (
    <EventFormSection
      eyebrow="Capacity & Check-In"
      title="Registration, Points, and Description"
      description="Manage attendance limits, points value, and the published event description."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <EventFieldShell label="Capacity">
          <Input
            type="number"
            min={0}
            value={form.capacity}
            onChange={(e) =>
              onSetField(
                "capacity",
                (e.target.value === "" ? 0 : Number(e.target.value)) as UpdateEventPayload["capacity"]
              )
            }
            className={EVENT_INPUT_CLASSNAME}
            disabled={isBusy}
          />
        </EventFieldShell>

        <EventFieldShell label="Points Value">
          <Input
            type="number"
            min={0}
            value={form.pointsValue}
            onChange={(e) =>
              onSetField(
                "pointsValue",
                (e.target.value === "" ? 0 : Number(e.target.value)) as UpdateEventPayload["pointsValue"]
              )
            }
            className={EVENT_INPUT_CLASSNAME}
            disabled={isBusy}
          />
        </EventFieldShell>

        <div className="md:col-span-2">
          <EventFieldShell label="Check-In Code">
            <div className="flex h-13 items-center rounded-[1.05rem] border border-[rgba(11,45,91,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(244,247,252,0.96)_100%)] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_24px_-18px_rgba(11,18,32,0.12)]">
              <Ticket className="mr-3 h-4 w-4 text-primary" />
              <span className="font-mono text-sm font-black tracking-[0.18em] text-foreground">
                {getEventCheckInCode(eventRecord)}
              </span>
            </div>
          </EventFieldShell>
        </div>

        <div className="md:col-span-2">
          <EventFieldShell label="Description">
            <textarea
              value={form.description}
              onChange={(e) => onSetField("description", e.target.value)}
              placeholder="Describe the event"
              rows={6}
              className={EVENT_TEXTAREA_CLASSNAME}
              disabled={isBusy}
            />
          </EventFieldShell>
        </div>
      </div>
    </EventFormSection>
  );
}