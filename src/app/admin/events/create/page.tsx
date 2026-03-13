"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import AdminHeader from "../../_components/AdminHeader/AdminHeader";
import { Button } from "@/components/ui/button";

type EventCategory =
  | "VOLUNTEERING"
  | "SOCIAL"
  | "PROFESSIONAL_DEVELOPMENT";

type CreateEventPayload = {
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

const defaultForm: CreateEventPayload = {
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

export default function AdminCreateEventPage() {
  const router = useRouter();

  const [form, setForm] = React.useState<CreateEventPayload>(defaultForm);
  const [submitting, setSubmitting] = React.useState(false);

  const onChange =
    (key: keyof CreateEventPayload) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const value = e.target.value;

      setForm((prev) => ({
        ...prev,
        [key]:
          key === "capacity" || key === "pointsValue" ? Number(value) : value,
      }));
    };

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

  const submitCreateEvent = async () => {
    if (submitting) return;

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
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

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to create event");
      }

      toast.success(json?.message || "Event created successfully", {
        description: "Redirecting...",
      });

      window.setTimeout(() => {
        router.push("/admin/events");
        router.refresh();
      }, 700);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create event";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitCreateEvent();
  };

  return (
    <div className="space-y-8 pb-16">
      <AdminHeader
        title="Create Event"
        subtitle="Create and publish a new event for members"
      />

      <AnimatePresence mode="popLayout">
        <motion.div
          key="admin-create-event"
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
                  Dates are submitted as plain calendar dates in YYYY-MM-DD
                  format.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} noValidate className="p-6 pb-14">
            <div className="grid gap-6 md:grid-cols-2">
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
                onClick={() => void submitCreateEvent()}
                className="min-w-[180px] rounded-2xl"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Event"
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
}