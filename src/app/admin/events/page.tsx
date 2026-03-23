"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Clock3,
  Users,
  Award,
  ShieldCheck,
} from "lucide-react";

import AdminHeader from "../_components/AdminHeader/AdminHeader";
import { Button } from "@/components/ui/button";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  DetailSection,
  DetailLabel,
  DetailStatCard,
} from "@/components/ui/sheet";
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
  DeleteButton,
  EditButton,
  EventStatusBadge,
  formatShortDate,
  StackedInfoCell,
  ViewButton,
  ConfirmDeleteDialog,
} from "@/components/admin/AdminEntityUI";

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

function formatEventDate(dateIso: string) {
  return formatShortDate(dateIso);
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
  const [viewingEvent, setViewingEvent] = React.useState<AdminEvent | null>(null);
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
    <div className="pt-9 space-y-6 overflow-x-hidden">
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
            <Table className="min-w-[1320px] border-separate border-spacing-0 text-[13px]">
              <TableHeader className="bg-secondary/20 text-[9px] uppercase tracking-[0.18em] text-muted-foreground/85">
                <TableRow>
                  <TableHead className="border-b border-r border-border/60 px-4 py-3 text-left font-black">Event</TableHead>
                  <TableHead className="border-b border-r border-border/60 px-4 py-3 text-left font-black">Category</TableHead>
                  <TableHead className="border-b border-r border-border/60 px-4 py-3 text-left font-black">Date</TableHead>
                  <TableHead className="border-b border-r border-border/60 px-4 py-3 text-left font-black">Time</TableHead>
                  <TableHead className="border-b border-r border-border/60 px-4 py-3 text-left font-black">Location</TableHead>
                  <TableHead className="border-b border-r border-border/60 px-4 py-3 text-right font-black">Capacity</TableHead>
                  <TableHead className="border-b border-r border-border/60 px-4 py-3 text-right font-black">Points</TableHead>
                  <TableHead className="border-b border-r border-border/60 px-4 py-3 text-left font-black">Status</TableHead>
                  <TableHead className="border-b border-r border-border/60 px-4 py-3 text-left font-black">Check-In Code</TableHead>
                  <TableHead className="border-b border-border/60 px-4 py-3 text-right font-black">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {events.map((event) => {
                  const isDeleting = deletingEventId === event.id;

                  return (
                    <TableRow key={event.id} className="bg-white/55 transition-colors hover:bg-white/82">
                      <TableCell className="border-b border-r border-border/50 px-4 py-4 align-middle">
                        <StackedInfoCell
                          primary={<span className="font-bold text-foreground">{event.title}</span>}
                          secondary={event.description?.trim() || "No description provided."}
                        />
                      </TableCell>

                      <TableCell className="border-b border-r border-border/50 px-4 py-4 align-middle">
                        <span className="font-medium text-foreground">{formatCategory(event.category)}</span>
                      </TableCell>

                      <TableCell className="border-b border-r border-border/50 px-4 py-4 align-middle text-[12px] text-muted-foreground">
                        {formatEventDate(event.date)}
                      </TableCell>

                      <TableCell className="border-b border-r border-border/50 px-4 py-4 align-middle text-[12px] text-muted-foreground">
                        {formatEventTimeRange(event.startTime, event.endTime)}
                      </TableCell>

                      <TableCell className="border-b border-r border-border/50 px-4 py-4 align-middle text-[12px] text-muted-foreground">
                        {event.location}
                      </TableCell>

                      <TableCell className="border-b border-r border-border/50 px-4 py-4 text-right align-middle font-black text-foreground">
                        {getCapacityLabel(event)}
                      </TableCell>

                      <TableCell className="border-b border-r border-border/50 px-4 py-4 text-right align-middle font-black text-foreground">
                        {event.pointsValue}
                      </TableCell>

                      <TableCell className="border-b border-r border-border/50 px-4 py-4 align-middle">
                        <EventStatusBadge isCompleted={isCompletedEvent(event.date)} />
                      </TableCell>

                      <TableCell className="border-b border-r border-border/50 px-4 py-4 align-middle">
                        <span className="inline-flex rounded-xl border border-border/60 bg-secondary/30 px-2.5 py-1 font-mono text-[11px] font-black tracking-[0.12em] text-foreground">
                          {getCheckInCode(event)}
                        </span>
                      </TableCell>

                      <TableCell className="border-b border-border/50 px-4 py-4 align-middle">
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

      <Sheet open={!!viewingEvent} onOpenChange={(open) => !open && setViewingEvent(null)}>
        <SheetContent side="right">
          {viewingEvent && (
            <>
              <SheetHeader>
                <SheetTitle>Event Overview</SheetTitle>
                <SheetDescription>
                  Review event scheduling, registration, points, and check-in details.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-4 grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <DetailSection title="Event Profile" icon={<CalendarDays className="h-4 w-4 text-primary" />}>
                    <div className="mb-4">
                      <p className="text-xl font-black tracking-tight text-foreground">
                        {viewingEvent.title}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {viewingEvent.description?.trim() || "No description provided."}
                      </p>
                    </div>

                    <div className="grid gap-4 text-sm">
                      <div className="flex items-start gap-3">
                        <CalendarDays className="mt-0.5 h-4 w-4 text-primary" />
                        <div>
                          <DetailLabel>Date</DetailLabel>
                          <p className="mt-1 font-medium text-foreground">
                            {formatEventDate(viewingEvent.date)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                        <div>
                          <DetailLabel>Time</DetailLabel>
                          <p className="mt-1 font-medium text-foreground">
                            {formatEventTimeRange(viewingEvent.startTime, viewingEvent.endTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                        <div>
                          <DetailLabel>Location</DetailLabel>
                          <p className="mt-1 font-medium text-foreground">{viewingEvent.location}</p>
                        </div>
                      </div>
                    </div>
                  </DetailSection>

                  <div className="space-y-4">
                    <DetailSection title="Event Status" icon={<ShieldCheck className="h-4 w-4 text-primary" />}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <DetailLabel>Category</DetailLabel>
                          <p className="mt-1 font-medium text-foreground">
                            {formatCategory(viewingEvent.category)}
                          </p>
                        </div>

                        <div>
                          <DetailLabel>Status</DetailLabel>
                          <div className="mt-1">
                            <EventStatusBadge isCompleted={isCompletedEvent(viewingEvent.date)} />
                          </div>
                        </div>
                      </div>
                    </DetailSection>

                    <DetailSection title="Registration Summary" icon={<Users className="h-4 w-4 text-primary" />}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <DetailStatCard label="Capacity" value={viewingEvent.capacity} />
                        <DetailStatCard label="Registered" value={viewingEvent.totalRegistered} />
                      </div>
                    </DetailSection>
                  </div>
                </div>

                <DetailSection title="Check-In & Points" icon={<Award className="h-4 w-4 text-primary" />}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <DetailLabel>Points Value</DetailLabel>
                      <p className="mt-1 font-medium text-foreground">{viewingEvent.pointsValue}</p>
                    </div>

                    <div>
                      <DetailLabel>Check-In Code</DetailLabel>
                      <p className="mt-1 font-mono text-sm font-black text-foreground">
                        {getCheckInCode(viewingEvent)}
                      </p>
                    </div>

                    <div>
                      <DetailLabel>Created</DetailLabel>
                      <p className="mt-1 font-medium text-foreground">
                        {formatEventDate(viewingEvent.createdAt)}
                      </p>
                    </div>

                    <div>
                      <DetailLabel>Updated</DetailLabel>
                      <p className="mt-1 font-medium text-foreground">
                        {formatEventDate(viewingEvent.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button type="button" onClick={() => router.push(`/admin/events/${viewingEvent.id}/edit`)}>
                      Edit Event
                    </Button>
                  </div>
                </DetailSection>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

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