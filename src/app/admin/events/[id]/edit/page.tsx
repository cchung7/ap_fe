"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Loader2 } from "lucide-react";

import AdminHeader from "../../../_components/AdminHeader/AdminHeader";
import { Button } from "@/components/ui/button";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";

type EventCategory =
  | "VOLUNTEERING"
  | "SOCIAL"
  | "PROFESSIONAL_DEVELOPMENT";

type AdminEvent = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description?: string | null;
  capacity: number;
  pointsValue: number;
  category: EventCategory;
  code?: string | null;
  checkInCode?: string | null;
  createdAt: string;
  updatedAt: string;
};

type EventsApiResponse = {
  success?: boolean;
  message?: string;
  data?: AdminEvent[];
};

type UpdateEventPayload = {
  title: string;
  category: EventCategory;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  capacity: number;
  pointsValue: number;
};

type UpdateEventApiResponse = {
  success?: boolean;
  message?: string;
  data?: AdminEvent;
};

const defaultForm: UpdateEventPayload = {
  title: "",
  category: "VOLUNTEERING",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  description: "",
  capacity: 0,
  pointsValue: 0,
};

const INPUT_CLASSNAME =
  "h-12 w-full rounded-2xl border border-border/60 bg-background px-4 text-sm outline-none transition focus:border-ring";

function normalizeDateForInput(value: string) {
  if (!value) return "";
  const match = value.match(/^\d{4}-\d{2}-\d{2}/);
  if (match) return match[0];
  return "";
}

function normalizeTimeForInput(value: string) {
  if (!value) return "";
  const match = value.match(/^\d{2}:\d{2}/);
  if (match) return match[0];
  return value.slice(0, 5);
}

function getEventCode(event: AdminEvent | null) {
  if (!event) return "";
  return event.checkInCode || event.code || "";
}

export default function AdminEditEventPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { showError, showSuccess, clear } = useGlobalStatusBanner();

  const eventId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [form, setForm] = React.useState<UpdateEventPayload>(defaultForm);
  const [eventRecord, setEventRecord] = React.useState<AdminEvent | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const onChange =
    (key: keyof UpdateEventPayload) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const value = e.target.value;

      clear();
      setForm((prev) => ({
        ...prev,
        [key]:
          key === "capacity" || key === "pointsValue" ? Number(value) : value,
      }));
    };

  React.useEffect(() => {
    let cancelled = false;

    async function loadEvent() {
      if (!eventId) {
        setLoadError("Missing event id.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError(null);

      try {
        const res = await fetch("/api/admin/events", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const json = (await res.json().catch(() => null)) as EventsApiResponse | null;

        if (!res.ok || !json?.success) {
          throw new Error(json?.message || "Failed to fetch event details");
        }

        const events = Array.isArray(json.data) ? json.data : [];
        const found = events.find((event) => event.id === eventId);

        if (!found) {
          throw new Error("Event not found");
        }

        if (cancelled) return;

        setEventRecord(found);
        setForm({
          title: found.title ?? "",
          category: found.category ?? "VOLUNTEERING",
          date: normalizeDateForInput(found.date),
          startTime: normalizeTimeForInput(found.startTime),
          endTime: normalizeTimeForInput(found.endTime),
          location: found.location ?? "",
          description: found.description ?? "",
          capacity: Number(found.capacity ?? 0),
          pointsValue: Number(found.pointsValue ?? 0),
        });
      } catch (error) {
        if (cancelled) return;
        setLoadError(
          error instanceof Error ? error.message : "Failed to fetch event details"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadEvent();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const getTodayLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const day = `${now.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.date) return "Date is required";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date)) {
      return "Date must be in YYYY-MM-DD format";
    }
    if (form.date < getTodayLocalDateString()) {
      return "Date cannot be in the past";
    }
    if (!form.startTime) return "Start time is required";
    if (!form.endTime) return "End time is required";
    if (form.startTime >= form.endTime) {
      return "End time must be later than start time";
    }
    if (!form.location.trim()) return "Location is required";
    if (form.capacity <= 0) return "Capacity must be greater than 0";
    if (form.pointsValue <= 0) return "Points value must be greater than 0";
    if (!form.description.trim()) return "Please provide a description";

    return "";
  };

  const submitUpdateEvent = async () => {
    if (!eventId || submitting) return;

    clear();

    const validationError = validateForm();
    if (validationError) {
      showError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          title: form.title.trim(),
          location: form.location.trim(),
          description: form.description.trim(),
        }),
      });

      const json = (await res.json().catch(() => null)) as UpdateEventApiResponse | null;

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to update event");
      }

      showSuccess(json?.message || "Event updated successfully. Redirecting...");

      window.setTimeout(() => {
        router.push("/admin/events");
        router.refresh();
      }, 700);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update event";
      showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitUpdateEvent();
  };

  return (
    <div className="space-y-8 pb-16">
      <AdminHeader
        title="Edit Event"
        subtitle="Update event details, schedule, points, and published information"
        icon={CalendarDays}
      />

      <AnimatePresence mode="popLayout">
        <motion.div
          key="admin-edit-event"
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="overflow-hidden rounded-[2.5rem] border border-border/60 bg-secondary/10"
        >
          <div className="border-b border-border/50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground/70">
                  Event Details
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Update the event record below. The check-in code is generated at
                  creation time and shown here for reference.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center p-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading event details...
              </div>
            </div>
          ) : loadError ? (
            <div className="p-6">
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-5 text-sm text-destructive">
                {loadError}
              </div>

              <div className="mt-6 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/admin/events")}
                  className="min-w-[180px] rounded-2xl"
                >
                  Back to Events
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} noValidate className="p-6 pb-14">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                    Check-In Code
                  </label>
                  <input
                    type="text"
                    value={getEventCode(eventRecord)}
                    readOnly
                    className="h-12 w-full rounded-2xl border border-border/60 bg-secondary/30 px-4 font-mono text-sm font-black tracking-[0.2em] text-foreground outline-none"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                    Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={onChange("title")}
                    placeholder="Enter event title"
                    className={INPUT_CLASSNAME}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={onChange("category")}
                    className={INPUT_CLASSNAME}
                  >
                    <option value="VOLUNTEERING">Volunteering</option>
                    <option value="SOCIAL">Social</option>
                    <option value="PROFESSIONAL_DEVELOPMENT">
                      Professional Development
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={onChange("date")}
                    className={INPUT_CLASSNAME}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={onChange("startTime")}
                    className={INPUT_CLASSNAME}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={onChange("endTime")}
                    className={INPUT_CLASSNAME}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={onChange("location")}
                    placeholder="Enter event location"
                    className={INPUT_CLASSNAME}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                    Capacity
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.capacity}
                    onChange={onChange("capacity")}
                    className={INPUT_CLASSNAME}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                    Points Value
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.pointsValue}
                    onChange={onChange("pointsValue")}
                    className={INPUT_CLASSNAME}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={onChange("description")}
                    placeholder="Describe the event"
                    rows={6}
                    className="w-full resize-none rounded-2xl border border-border/60 bg-background px-4 py-3 text-sm outline-none transition focus:border-ring"
                  />
                </div>
              </div>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 border-t border-border/50 pt-8 sm:flex-row">
                <Button
                  type="button"
                  variant="logout"
                  size="lg"
                  onClick={() => void submitUpdateEvent()}
                  className="min-w-[180px] rounded-2xl"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/admin/events")}
                  className="min-w-[180px] rounded-2xl"
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}