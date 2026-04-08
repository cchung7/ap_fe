"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";
import { ConfirmDeleteDialog } from "@/components/admin/AdminEntityUI";
import { EventDetailSheet, type AdminEventDetail } from "@/components/admin/EventDetailSheet";

import { EventsPageHero } from "./_components/EventsPageHero";
import { EventsOverview } from "./_components/EventsOverview";
import { EventsTableSection } from "./_components/EventsTableSection";
import {
  AdminEvent,
  DeleteEventApiResponse,
  EventsApiResponse,
  isCompletedEvent,
} from "./_components/eventsShared";

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

  const upcomingCount = React.useMemo(
    () => events.filter((event) => !isCompletedEvent(event.date)).length,
    [events]
  );

  const completedCount = React.useMemo(
    () => events.filter((event) => isCompletedEvent(event.date)).length,
    [events]
  );

  const totalRegistrations = React.useMemo(
    () =>
      events.reduce((sum, event) => sum + Number(event.totalRegistered ?? 0), 0),
    [events]
  );

  return (
    <div className="relative min-w-0 space-y-5 overflow-x-clip pt-5 pb-10 sm:space-y-6 sm:pt-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[20rem] bg-navy-wash opacity-75" />

      <EventsPageHero onCreate={() => router.push("/admin/events/create")} />

      <EventsOverview
        totalEvents={events.length}
        upcomingEvents={upcomingCount}
        completedEvents={completedCount}
        totalRegistrations={totalRegistrations}
      />

      <EventsTableSection
        events={events}
        loading={loading}
        error={error}
        deletingEventId={deletingEventId}
        onView={(event) => setViewingEvent(event)}
        onEdit={(event) => router.push(`/admin/events/${event.id}/edit`)}
        onDelete={(event) => setConfirmDeleteEvent(event)}
      />

      <EventDetailSheet
        event={viewingEvent}
        open={!!viewingEvent}
        onOpenChange={(open) => {
          if (!open) setViewingEvent(null);
        }}
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