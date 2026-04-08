"use client";

import * as React from "react";

import { AdminTableViewport } from "@/components/ui/table";
import { AdminEvent } from "./eventsShared";
import { EventsTable } from "./EventsTable";

type EventsTableSectionProps = {
  events: AdminEvent[];
  loading: boolean;
  error: string | null;
  deletingEventId: string | null;
  onView: (event: AdminEvent) => void;
  onEdit: (event: AdminEvent) => void;
  onDelete: (event: AdminEvent) => void;
};

export function EventsTableSection({
  events,
  loading,
  error,
  deletingEventId,
  onView,
  onEdit,
  onDelete,
}: EventsTableSectionProps) {
  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-[1.55rem] border border-border/60 bg-white/72 shadow-master backdrop-blur-md">
      <div className="border-b border-border/60 px-5 py-4.5 sm:px-6 sm:py-5">
        <p className="ui-eyebrow text-muted-foreground">Events Directory</p>
        <h2 className="mt-1 text-[1.18rem] font-black tracking-tight text-foreground">
          All Events
        </h2>
        <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
          A list for reviewing events and launching event actions.
        </p>
      </div>

      <div className="min-w-0 max-w-full">
        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground sm:px-6">
            Loading events...
          </div>
        ) : error ? (
          <div className="px-5 py-10 text-center text-sm text-destructive sm:px-6">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground sm:px-6">
            No events have been created yet.
          </div>
        ) : (
          <div className="min-w-0 max-w-full overflow-hidden">
            <AdminTableViewport className="w-full max-w-full overflow-x-auto overscroll-x-contain cursor-grab active:cursor-grabbing">
              <EventsTable
                events={events}
                deletingEventId={deletingEventId}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </AdminTableViewport>
          </div>
        )}
      </div>
    </section>
  );
}