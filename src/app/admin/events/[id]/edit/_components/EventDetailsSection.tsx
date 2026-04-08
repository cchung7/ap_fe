"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { EventFormSection } from "./EventFormSection";
import {
  EventFieldShell,
  EVENT_INPUT_CLASSNAME,
} from "./EventFieldShell";
import type { UpdateEventPayload } from "../../../_components/eventsShared";

type EventDetailsSectionProps = {
  form: UpdateEventPayload;
  isBusy: boolean;
  onSetField: <K extends keyof UpdateEventPayload>(
    field: K,
    value: UpdateEventPayload[K]
  ) => void;
};

export function EventDetailsSection({
  form,
  isBusy,
  onSetField,
}: EventDetailsSectionProps) {
  return (
    <EventFormSection
      eyebrow="Event Details"
      title="Schedule and Publishing"
      description="Update the primary event information shown to members and administrators."
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <EventFieldShell label="Title">
            <Input
              type="text"
              value={form.title}
              onChange={(e) => onSetField("title", e.target.value)}
              placeholder="Enter event title"
              className={EVENT_INPUT_CLASSNAME}
              disabled={isBusy}
            />
          </EventFieldShell>
        </div>

        <EventFieldShell label="Category">
          <select
            value={form.category}
            onChange={(e) =>
              onSetField(
                "category",
                e.target.value as UpdateEventPayload["category"]
              )
            }
            className={EVENT_INPUT_CLASSNAME}
            disabled={isBusy}
          >
            <option value="VOLUNTEERING">Volunteering</option>
            <option value="SOCIAL">Social</option>
            <option value="PROFESSIONAL_DEVELOPMENT">
              Professional Development
            </option>
          </select>
        </EventFieldShell>

        <EventFieldShell label="Date">
          <Input
            type="date"
            value={form.date}
            onChange={(e) => onSetField("date", e.target.value)}
            className={EVENT_INPUT_CLASSNAME}
            disabled={isBusy}
          />
        </EventFieldShell>

        <EventFieldShell label="Start Time">
          <Input
            type="time"
            value={form.startTime}
            onChange={(e) => onSetField("startTime", e.target.value)}
            className={EVENT_INPUT_CLASSNAME}
            disabled={isBusy}
          />
        </EventFieldShell>

        <EventFieldShell label="End Time">
          <Input
            type="time"
            value={form.endTime}
            onChange={(e) => onSetField("endTime", e.target.value)}
            className={EVENT_INPUT_CLASSNAME}
            disabled={isBusy}
          />
        </EventFieldShell>

        <div className="md:col-span-2">
          <EventFieldShell label="Location">
            <Input
              type="text"
              value={form.location}
              onChange={(e) => onSetField("location", e.target.value)}
              placeholder="Enter event location"
              className={EVENT_INPUT_CLASSNAME}
              disabled={isBusy}
            />
          </EventFieldShell>
        </div>
      </div>
    </EventFormSection>
  );
}