"use client";

import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EventStatusBadge, formatShortDate } from "@/components/admin/AdminEntityUI";
import { EventsTableRowActions } from "./EventsTableRowActions";
import {
  AdminEvent,
  formatEventCategory,
  formatEventTimeRange,
  isCompletedEvent,
} from "./eventsShared";

type EventsTableProps = {
  events: AdminEvent[];
  deletingEventId: string | null;
  onView: (event: AdminEvent) => void;
  onEdit: (event: AdminEvent) => void;
  onDelete: (event: AdminEvent) => void;
};

export function EventsTable({
  events,
  deletingEventId,
  onView,
  onEdit,
  onDelete,
}: EventsTableProps) {
  return (
    <Table className="w-full min-w-[760px] table-fixed border-separate border-spacing-0 text-[13px]">
      <colgroup>
        <col className="w-[56%]" />
        <col className="w-[14%]" />
        <col className="w-[30%]" />
      </colgroup>

      <TableHeader className="bg-secondary/20">
        <TableRow>
          <TableHead className="border-b border-r border-border/60 px-3 py-3 text-center text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground/85 sm:px-4">
            List of All Events
          </TableHead>

          <TableHead className="border-b border-r border-border/60 px-3 py-3 text-center text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground/85 sm:px-4">
            Status
          </TableHead>

          <TableHead className="border-b border-border/60 px-3 py-3 text-center text-[9px] font-black uppercase tracking-[0.18em] text-muted-foreground/85 sm:px-4">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {events.map((event) => {
          const completed = isCompletedEvent(event.date);

          return (
            <TableRow
              key={event.id}
              className="bg-white/55 transition-colors hover:bg-white/82"
            >
              <TableCell className="border-b border-r border-border/50 px-4 py-4 align-middle">
                <div className="min-w-0">
                  <p className="truncate text-[1rem] font-black tracking-tight text-foreground">
                    {event.title}
                  </p>

                  <p className="mt-1 truncate text-[12px] text-muted-foreground">
                    {event.description?.trim() || "No description provided."}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                    <span>{formatEventCategory(event.category)}</span>
                    <span>•</span>
                    <span>{formatShortDate(event.date)}</span>
                    <span>•</span>
                    <span>{formatEventTimeRange(event.startTime, event.endTime)}</span>
                    <span>•</span>
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </TableCell>

              <TableCell className="border-b border-r border-border/50 px-3 py-4 align-middle text-center sm:px-4">
                <div className="flex justify-center">
                  <EventStatusBadge isCompleted={completed} />
                </div>
              </TableCell>

              <TableCell className="border-b border-border/50 px-3 py-4 align-middle sm:px-4">
                <EventsTableRowActions
                  isDeleting={deletingEventId === event.id}
                  onView={() => onView(event)}
                  onEdit={() => onEdit(event)}
                  onDelete={() => onDelete(event)}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}