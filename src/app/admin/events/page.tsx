"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Eye,
  Loader2,
  Pencil,
  Trash2,
  MapPin,
  Clock3,
  Users,
  Award,
  ShieldCheck,
} from "lucide-react";

import AdminHeader from "../_components/AdminHeader/AdminHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DragScrollX } from "@/components/ui/DragScrollX";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";

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

function getEventStatus(dateIso: string) {
  const eventDay = getChicagoDateKey(dateIso);
  const todayDay = getChicagoDateKey(new Date());

  if (eventDay < todayDay) return "COMPLETED";
  return "UPCOMING";
}

function getEventStatusLabel(dateIso: string) {
  return getEventStatus(dateIso) === "COMPLETED" ? "Completed" : "Upcoming";
}

function getEventStatusBadgeVariant(
  dateIso: string
): "default" | "secondary" | "outline" {
  return getEventStatus(dateIso) === "COMPLETED" ? "outline" : "default";
}

function formatEventDate(dateIso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(dateIso));
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

    const confirmed = window.confirm(
      `Delete "${eventTitle}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

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
      showSuccess(json?.message || "Event deleted successfully.");
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

      <AnimatePresence mode="popLayout">
        <motion.div
          key="admin-events-table"
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="overflow-hidden rounded-[2.5rem] border border-border/70 bg-background/70 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.25)]"
        >
          <div className="border-b border-border/60 bg-secondary/15 px-6 py-5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground/75">
              Events Table
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Standardized admin view with event details, right-side actions, and
              extended modal support.
            </p>
          </div>

          <DragScrollX>
            {loading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Loading events...
              </div>
            ) : error ? (
              <div className="py-12 text-center text-sm text-destructive">
                {error}
              </div>
            ) : events.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No events have been created yet.
              </div>
            ) : (
              <table className="w-full min-w-[1320px] border-separate border-spacing-0 text-[13px]">
                <thead className="bg-secondary/20 text-[9px] uppercase tracking-[0.18em] text-muted-foreground/85">
                  <tr>
                    <th className="border-b border-r border-border/60 px-4 py-3 text-left font-black">
                      Event
                    </th>
                    <th className="border-b border-r border-border/60 px-4 py-3 text-left font-black">
                      Category
                    </th>
                    <th className="border-b border-r border-border/60 px-4 py-3 text-left font-black">
                      Date
                    </th>
                    <th className="border-b border-r border-border/60 px-4 py-3 text-left font-black">
                      Time
                    </th>
                    <th className="border-b border-r border-border/60 px-4 py-3 text-left font-black">
                      Location
                    </th>
                    <th className="border-b border-r border-border/60 px-4 py-3 text-right font-black">
                      Capacity
                    </th>
                    <th className="border-b border-r border-border/60 px-4 py-3 text-right font-black">
                      Points
                    </th>
                    <th className="border-b border-r border-border/60 px-4 py-3 text-left font-black">
                      Status
                    </th>
                    <th className="border-b border-r border-border/60 px-4 py-3 text-left font-black">
                      Check-In Code
                    </th>
                    <th className="border-b border-border/60 px-4 py-3 text-right font-black">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => {
                    const isDeleting = deletingEventId === event.id;

                    return (
                      <tr
                        key={event.id}
                        className="bg-white/55 transition-colors hover:bg-white/82"
                      >
                        <td className="border-b border-r border-border/50 px-4 py-4 align-middle">
                          <div className="space-y-1">
                            <p className="font-bold text-foreground">{event.title}</p>
                            <p className="text-[12px] text-muted-foreground">
                              {event.description?.trim() || "No description provided."}
                            </p>
                          </div>
                        </td>

                        <td className="border-b border-r border-border/50 px-4 py-4 align-middle">
                          <p className="font-medium text-foreground">
                            {formatCategory(event.category)}
                          </p>
                        </td>

                        <td className="border-b border-r border-border/50 px-4 py-4 align-middle text-[12px] text-muted-foreground">
                          {formatEventDate(event.date)}
                        </td>

                        <td className="border-b border-r border-border/50 px-4 py-4 align-middle text-[12px] text-muted-foreground">
                          {formatEventTimeRange(event.startTime, event.endTime)}
                        </td>

                        <td className="border-b border-r border-border/50 px-4 py-4 align-middle text-[12px] text-muted-foreground">
                          {event.location}
                        </td>

                        <td className="border-b border-r border-border/50 px-4 py-4 text-right align-middle font-black text-foreground">
                          {getCapacityLabel(event)}
                        </td>

                        <td className="border-b border-r border-border/50 px-4 py-4 text-right align-middle font-black text-foreground">
                          {event.pointsValue}
                        </td>

                        <td className="border-b border-r border-border/50 px-4 py-4 align-middle">
                          <Badge variant={getEventStatusBadgeVariant(event.date)}>
                            {getEventStatusLabel(event.date)}
                          </Badge>
                        </td>

                        <td className="border-b border-r border-border/50 px-4 py-4 align-middle">
                          <span className="inline-flex rounded-xl border border-border/60 bg-secondary/30 px-2.5 py-1 font-mono text-[11px] font-black tracking-[0.12em] text-foreground">
                            {getCheckInCode(event)}
                          </span>
                        </td>

                        <td className="border-b border-border/50 px-4 py-4 align-middle">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-lg border-border/70 px-2.5 text-[9px] font-black uppercase tracking-[0.15em]"
                              onClick={() => setViewingEvent(event)}
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-lg border-border/70 px-2.5 text-[9px] font-black uppercase tracking-[0.15em]"
                              onClick={() => {
                                router.push(`/admin/events/${event.id}/edit`);
                              }}
                            >
                              <Pencil className="h-3 w-3" />
                              Edit
                            </Button>

                            <Button
                              type="button"
                              variant="logout"
                              size="sm"
                              className="h-8 rounded-lg px-2.5 text-[9px] font-black uppercase tracking-[0.15em]"
                              onClick={() => void handleDeleteEvent(event.id, event.title)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-3 w-3" />
                                  Delete
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </DragScrollX>
        </motion.div>
      </AnimatePresence>

      <Dialog open={!!viewingEvent} onOpenChange={(open) => !open && setViewingEvent(null)}>
        <DialogContent className="max-w-4xl">
          {viewingEvent && (
            <>
              <DialogHeader>
                <DialogTitle>Event Overview</DialogTitle>
                <DialogDescription>
                  Review event scheduling, registration, points, and check-in details.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-secondary/10 p-4">
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
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                          Date
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {formatEventDate(viewingEvent.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                          Time
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {formatEventTimeRange(
                            viewingEvent.startTime,
                            viewingEvent.endTime
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                          Location
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {viewingEvent.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border/60 bg-secondary/10 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-foreground">
                        Event Status
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                          Category
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {formatCategory(viewingEvent.category)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                          Status
                        </p>
                        <div className="mt-1">
                          <Badge variant={getEventStatusBadgeVariant(viewingEvent.date)}>
                            {getEventStatusLabel(viewingEvent.date)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-secondary/10 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-foreground">
                        Registration Summary
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-border/50 bg-background/70 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                          Capacity
                        </p>
                        <p className="mt-2 text-2xl font-black text-foreground">
                          {viewingEvent.capacity}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border/50 bg-background/70 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                          Registered
                        </p>
                        <p className="mt-2 text-2xl font-black text-foreground">
                          {viewingEvent.totalRegistered}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-secondary/10 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-foreground">
                        Check-In & Points
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                          Points Value
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {viewingEvent.pointsValue}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                          Check-In Code
                        </p>
                        <p className="mt-1 font-mono text-sm font-black text-foreground">
                          {getCheckInCode(viewingEvent)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                          Created
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {formatEventDate(viewingEvent.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/75">
                          Updated
                        </p>
                        <p className="mt-1 font-medium text-foreground">
                          {formatEventDate(viewingEvent.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setViewingEvent(null)}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    router.push(`/admin/events/${viewingEvent.id}/edit`);
                  }}
                >
                  Edit Event
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}