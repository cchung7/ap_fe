"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  MapPin,
  ShieldCheck,
  Ticket,
  Users,
  Award,
} from "lucide-react";

import AdminHeader from "../_components/AdminHeader/AdminHeader";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";
import {
  ConfirmDeleteDialog,
  DeleteButton,
  EditButton,
  EventStatusBadge,
  formatShortDate,
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
      return "Professional Development";
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

function EventsSummary({
  totalEvents,
  upcomingEvents,
  completedEvents,
}: {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
}) {
  const cardClass =
    "rounded-[1.2rem] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,247,252,0.96)_100%)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_12px_24px_-18px_rgba(11,18,32,0.12)]";

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">

      <div className={cardClass}>
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">
          Upcoming Events
        </p>
        <p className="mt-2 text-[2rem] font-black leading-none tracking-tight text-foreground">
          {upcomingEvents}
        </p>
      </div>

      <div className={cardClass}>
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">
          Past Events
        </p>
        <p className="mt-2 text-[2rem] font-black leading-none tracking-tight text-foreground">
          {completedEvents}
        </p>
      </div>

      <div className={cardClass}>
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">
          Total Events
        </p>
        <p className="mt-2 text-[2rem] font-black leading-none tracking-tight text-foreground">
          {totalEvents}
        </p>
      </div>

    </section>
  );
}

function EventManagementRow({
  event,
  isDeleting,
  onView,
  onEdit,
  onDelete,
}: {
  event: AdminEvent;
  isDeleting: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const completed = isCompletedEvent(event.date);

  return (
    <article className="overflow-hidden rounded-[1.35rem] border border-border/60 bg-white/72 shadow-master backdrop-blur-md">
      <div className="grid gap-4 px-5 py-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)_auto] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-[1.02rem] font-black tracking-tight text-foreground">
              {event.title}
            </p>
            <EventStatusBadge isCompleted={completed} />
          </div>

          <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
            {event.description?.trim() || "No description provided."}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border/60 bg-white px-3 py-1 text-[11px] font-semibold text-foreground">
              {formatCategory(event.category)}
            </span>
            <span className="text-[12px] text-muted-foreground">
              Created {formatShortDate(event.createdAt)}
            </span>
          </div>
        </div>

        <div className="rounded-[1.15rem] border border-border/60 bg-secondary/15 px-4 py-4">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">
            Event Snapshot
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2.5">
              <CalendarDays className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                  Date
                </p>
                <p className="mt-1 text-[13px] text-foreground">
                  {formatShortDate(event.date)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                  Time
                </p>
                <p className="mt-1 text-[13px] text-foreground">
                  {formatEventTimeRange(event.startTime, event.endTime)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                  Location
                </p>
                <p className="mt-1 text-[13px] text-foreground">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Users className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                  Capacity
                </p>
                <p className="mt-1 text-[13px] text-foreground">
                  {getCapacityLabel(event)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Award className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                  Points
                </p>
                <p className="mt-1 text-[13px] text-foreground">{event.pointsValue}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Ticket className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                  Check-In Code
                </p>
                <p className="mt-1 font-mono text-[13px] font-black text-foreground">
                  {getCheckInCode(event)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          <ViewButton onClick={onView} />
          <EditButton onClick={onEdit} />
          <DeleteButton loading={isDeleting} onClick={onDelete} />
        </div>
      </div>
    </article>
  );
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

  const upcomingCount = React.useMemo(
    () => events.filter((event) => !isCompletedEvent(event.date)).length,
    [events]
  );

  const completedCount = React.useMemo(
    () => events.filter((event) => isCompletedEvent(event.date)).length,
    [events]
  );

  return (
    <div className="space-y-5 overflow-hidden pt-6 pb-12 sm:space-y-6 sm:pt-7 sm:pb-16">
      <AdminHeader
        title="All Events"
        subtitle="Manage scheduled events, registration capacity, and check-in details."
        icon={CalendarDays}
        actionLabel="Create Event"
        onAddClick={() => {
          router.push("/admin/events/create");
        }}
      />

      <EventsSummary
        totalEvents={events.length}
        upcomingEvents={upcomingCount}
        completedEvents={completedCount}
      />

      <section className="overflow-hidden rounded-[1.55rem] border border-border/60 bg-white/72 shadow-master backdrop-blur-md">
        <div className="border-b border-border/60 px-5 py-4.5 sm:px-6 sm:py-5">
          <p className="ui-eyebrow text-muted-foreground">Events Directory</p>
          <h2 className="mt-1 text-[1.18rem] font-black tracking-tight text-foreground">
            Event Management
          </h2>
          <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
            A responsive event management view standardized to the newer admin workspace design.
          </p>
        </div>

        <div className="px-4 py-4 sm:px-5 sm:py-5">
          {loading ? (
            <div className="rounded-[1.2rem] border border-dashed border-border/70 bg-white/60 px-5 py-10 text-center text-[13px] text-muted-foreground">
              Loading events...
            </div>
          ) : error ? (
            <div className="rounded-[1.2rem] border border-red-200 bg-red-50 px-5 py-10 text-center text-[13px] text-red-700">
              {error}
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-[1.2rem] border border-dashed border-border/70 bg-white/60 px-5 py-10 text-center text-[13px] text-muted-foreground">
              No events have been created yet.
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => {
                const isDeleting = deletingEventId === event.id;

                return (
                  <EventManagementRow
                    key={event.id}
                    event={event}
                    isDeleting={isDeleting}
                    onView={() => setViewingEvent(event)}
                    onEdit={() => router.push(`/admin/events/${event.id}/edit`)}
                    onDelete={() => setConfirmDeleteEvent(event)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

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