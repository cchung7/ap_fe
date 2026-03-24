// D:\ap_fe\src\app\admin\events\page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";

import AdminHeader from "../_components/AdminHeader/AdminHeader";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  AdminDataTableCard,
  AdminTableViewport,
  AdminTableState,
} from "@/components/ui/table";
import {
  ConfirmDeleteDialog,
  DeleteButton,
  EditButton,
  EventStatusBadge,
  formatShortDate,
  StackedInfoCell,
  ViewButton,
} from "@/components/admin/AdminEntityUI";
import { EventDetailSheet, type AdminEventDetail } from "@/components/admin/EventDetailSheet";

type EventCategory =
  | "VOLUNTEERING"
  | "SOCIAL"
  | "PROFESSIONAL_DEVELOPMENT";

type AdminEvent = {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description?: string | null;
  capacity: number;
  totalRegistered: number;
  pointsValue: number;
  checkInCode?: string | null;
  createdAt: string;
  updatedAt: string;
};

type EventsApiResponse = {
  success?: boolean;
  message?: string;
  data?: AdminEvent[];
};

type DeleteEventApiResponse = {
  success?: boolean;
  message?: string;
};

function getChicagoDateKey(input: string | Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(input));
}

function isCompletedEvent(dateIso: string) {
  const eventDay = getChicagoDateKey(dateIso);
  const todayDay = getChicagoDateKey(new Date());
  return eventDay < todayDay;
}

function formatEventTimeRange(startTime: string, endTime: string) {
  const formatOne = (value: string) => {
    const [hoursRaw, minutes] = value.split(":");
    const hours = Number(hoursRaw);

    if (Number.isNaN(hours) || !minutes) return value;

    const suffix = hours >= 12 ? "PM" : "AM";
    const normalized = hours % 12 || 12;
    return `${normalized}:${minutes} ${suffix}`;
  };

  return `${formatOne(startTime)} - ${formatOne(endTime)}`;
}

function formatCategory(category: EventCategory) {
  switch (category) {
    case "VOLUNTEERING":
      return "Volunteering";
    case "SOCIAL":
      return "Social";
    case "PROFESSIONAL_DEVELOPMENT":
      return "Professional Dev";
    default:
      return category;
  }
}

function getCheckInCode(event: AdminEvent) {
  return event.checkInCode?.trim() ? event.checkInCode : "—";
}

function getCapacityLabel(event: AdminEvent) {
  return `${event.totalRegistered}/${event.capacity}`;
}

export default function AdminEventsPage() {
  const router = useRouter();
  const { showError, showSuccess, clear } = useGlobalStatusBanner();

  const [events, setEvents] = React.useState<AdminEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingEventId, setDeletingEventId] = React.useState<string | null>(null);
  const [viewingEvent, setViewingEvent] = React.useState<AdminEventDetail | null>(null);
  const [confirmDeleteEvent, setConfirmDeleteEvent] = React.useState<AdminEvent | null>(null);

  const loadEvents = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/events", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const json = (await res.json().catch(() => null)) as EventsApiResponse | null;

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to fetch events");
      }

      setEvents(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (deletingEventId) return;

    clear();
    setDeletingEventId(eventId);

    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = (await res.json().catch(() => null)) as DeleteEventApiResponse | null;

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to delete event");
      }

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      setConfirmDeleteEvent(null);
      showSuccess(json?.message || `Deleted "${eventTitle}" successfully.`);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete event");
    } finally {
      setDeletingEventId(null);
    }
  };

  return (
    <div className="space-y-5 overflow-x-hidden pt-6 sm:pt-7">
      <AdminHeader
        title="All Events"
        subtitle="Manage scheduled events, registration capacity, and check-in details"
        icon={CalendarDays}
        actionLabel="Create Event"
        onAddClick={() => {
          router.push("/admin/events/create");
        }}
      />

      <AdminDataTableCard
        tableLabel="Events Table"
        description="Standardized admin view with event details, right-side actions, and extended detail sheet support."
      >
        <AdminTableViewport>
          <AdminTableState
            loading={loading}
            error={error}
            isEmpty={!loading && !error && events.length === 0}
            loadingMessage="Loading events..."
            emptyMessage="No events have been created yet."
          >
            <Table className="admin-table">
              <TableHeader className="admin-table-head">
                <TableRow>
                  <TableHead className="admin-table-head-cell">Event</TableHead>
                  <TableHead className="admin-table-head-cell">Category</TableHead>
                  <TableHead className="admin-table-head-cell">Date</TableHead>
                  <TableHead className="admin-table-head-cell">Time</TableHead>
                  <TableHead className="admin-table-head-cell">Location</TableHead>
                  <TableHead className="admin-table-head-cell-right">Capacity</TableHead>
                  <TableHead className="admin-table-head-cell-right">Points</TableHead>
                  <TableHead className="admin-table-head-cell">Status</TableHead>
                  <TableHead className="admin-table-head-cell">Check-In Code</TableHead>
                  <TableHead className="admin-table-head-cell-last">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {events.map((event) => {
                  const isDeleting = deletingEventId === event.id;

                  return (
                    <TableRow key={event.id} className="admin-table-row">
                      <TableCell className="admin-table-cell">
                        <StackedInfoCell
                          primary={<span className="font-bold text-foreground">{event.title}</span>}
                          secondary={event.description?.trim() || "No description provided."}
                        />
                      </TableCell>

                      <TableCell className="admin-table-cell">
                        <span className="font-medium text-foreground">
                          {formatCategory(event.category)}
                        </span>
                      </TableCell>

                      <TableCell className="admin-table-cell-muted">
                        {formatShortDate(event.date)}
                      </TableCell>

                      <TableCell className="admin-table-cell-muted">
                        {formatEventTimeRange(event.startTime, event.endTime)}
                      </TableCell>

                      <TableCell className="admin-table-cell-muted">
                        {event.location}
                      </TableCell>

                      <TableCell className="admin-table-cell-right">
                        {getCapacityLabel(event)}
                      </TableCell>

                      <TableCell className="admin-table-cell-right">
                        {event.pointsValue}
                      </TableCell>

                      <TableCell className="admin-table-cell">
                        <EventStatusBadge isCompleted={isCompletedEvent(event.date)} />
                      </TableCell>

                      <TableCell className="admin-table-cell">
                        <span className="admin-table-code-pill">{getCheckInCode(event)}</span>
                      </TableCell>

                      <TableCell className="admin-table-cell-last">
                        <div className="flex items-center justify-end gap-2">
                          <ViewButton onClick={() => setViewingEvent(event)} />
                          <EditButton onClick={() => router.push(`/admin/events/${event.id}/edit`)} />
                          <DeleteButton
                            loading={isDeleting}
                            onClick={() => setConfirmDeleteEvent(event)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </AdminTableState>
        </AdminTableViewport>
      </AdminDataTableCard>

      <EventDetailSheet
        event={viewingEvent}
        open={!!viewingEvent}
        onOpenChange={(open) => !open && setViewingEvent(null)}
        onEdit={(event) => router.push(`/admin/events/${event.id}/edit`)}
      />

      <ConfirmDeleteDialog
        open={!!confirmDeleteEvent}
        onOpenChange={(open) => !open && setConfirmDeleteEvent(null)}
        title="Delete Event"
        description="This will permanently delete the event. This action cannot be undone."
        primaryText={confirmDeleteEvent?.title || ""}
        secondaryText={confirmDeleteEvent?.location || ""}
        loading={deletingEventId === confirmDeleteEvent?.id}
        onConfirm={() => {
          if (!confirmDeleteEvent) return;
          void handleDeleteEvent(confirmDeleteEvent.id, confirmDeleteEvent.title);
        }}
      />
    </div>
  );
}