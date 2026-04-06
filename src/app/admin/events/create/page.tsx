"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, CalendarDays } from "lucide-react";

import AdminHeader from "../../_components/AdminHeader/AdminHeader";
import { Button } from "@/components/ui/button";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";

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

const FIELD_LABEL_CLASS =
  "text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/80";

const INPUT_CLASSNAME =
  "h-11 w-full rounded-[1rem] border border-[rgba(11,45,91,0.10)] bg-white px-4 text-[14px] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_24px_-18px_rgba(11,18,32,0.10)] outline-none transition placeholder:text-[12px] placeholder:text-muted-foreground/80 focus:border-accent/45";

const TEXTAREA_CLASSNAME =
  "w-full resize-none rounded-[1rem] border border-[rgba(11,45,91,0.10)] bg-white px-4 py-3 text-[14px] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_24px_-18px_rgba(11,18,32,0.10)] outline-none transition placeholder:text-[12px] placeholder:text-muted-foreground/80 focus:border-accent/45";

const SECTION_CLASS =
  "overflow-hidden rounded-[1.55rem] border border-border/60 bg-white/72 shadow-master backdrop-blur-md";

export default function AdminCreateEventPage() {
  const router = useRouter();
  const { showError, showSuccess, clear } = useGlobalStatusBanner();

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

      clear();
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

    clear();

    const validationError = validateForm();
    if (validationError) {
      showError(validationError);
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

      showSuccess(json?.message || "Event created successfully. Redirecting...");

      window.setTimeout(() => {
        router.push("/admin/events");
        router.refresh();
      }, 700);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create event";
      showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitCreateEvent();
  };

  return (
    <div className="space-y-5 overflow-hidden pt-6 pb-16 sm:space-y-6 sm:pt-7 sm:pb-20">
      <AdminHeader
        title="Create Event"
        subtitle="Create and publish a new event for members."
        icon={CalendarDays}
      />

      <form onSubmit={handleFormSubmit} noValidate className="space-y-6 sm:space-y-7">
        <section className={SECTION_CLASS}>
          <div className="border-b border-border/60 px-5 py-4.5 sm:px-6 sm:py-5">
            <p className="ui-eyebrow text-muted-foreground">Event Setup</p>
            <h2 className="mt-1 text-[1.18rem] font-black tracking-tight text-foreground">
              Event Details
            </h2>
            <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
              Enter the primary scheduling and publishing details for the new event.
            </p>
          </div>

          <div className="grid gap-4 px-5 py-5 md:grid-cols-2 sm:px-6">
            <div className="space-y-2 md:col-span-2">
              <label className={FIELD_LABEL_CLASS}>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={onChange("title")}
                placeholder="Enter event title"
                className={INPUT_CLASSNAME}
              />
            </div>

            <div className="space-y-2">
              <label className={FIELD_LABEL_CLASS}>Category</label>
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
              <label className={FIELD_LABEL_CLASS}>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={onChange("date")}
                className={INPUT_CLASSNAME}
              />
            </div>

            <div className="space-y-2">
              <label className={FIELD_LABEL_CLASS}>Start Time</label>
              <input
                type="time"
                value={form.startTime}
                onChange={onChange("startTime")}
                className={INPUT_CLASSNAME}
              />
            </div>

            <div className="space-y-2">
              <label className={FIELD_LABEL_CLASS}>End Time</label>
              <input
                type="time"
                value={form.endTime}
                onChange={onChange("endTime")}
                className={INPUT_CLASSNAME}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className={FIELD_LABEL_CLASS}>Location</label>
              <input
                type="text"
                value={form.location}
                onChange={onChange("location")}
                placeholder="Enter event location"
                className={INPUT_CLASSNAME}
              />
            </div>
          </div>
        </section>

        <section className={SECTION_CLASS}>
          <div className="border-b border-border/60 px-5 py-4.5 sm:px-6 sm:py-5">
            <p className="ui-eyebrow text-muted-foreground">Capacity & Content</p>
            <h2 className="mt-1 text-[1.18rem] font-black tracking-tight text-foreground">
              Registration and Description
            </h2>
            <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
              Set attendance limits, points value, and the member-facing description.
            </p>
          </div>

          <div className="grid gap-4 px-5 py-5 md:grid-cols-2 sm:px-6">
            <div className="space-y-2">
              <label className={FIELD_LABEL_CLASS}>Capacity</label>
              <input
                type="number"
                min={0}
                value={form.capacity}
                onChange={onChange("capacity")}
                className={INPUT_CLASSNAME}
              />
            </div>

            <div className="space-y-2">
              <label className={FIELD_LABEL_CLASS}>Points Value</label>
              <input
                type="number"
                min={0}
                value={form.pointsValue}
                onChange={onChange("pointsValue")}
                className={INPUT_CLASSNAME}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className={FIELD_LABEL_CLASS}>Description</label>
              <textarea
                value={form.description}
                onChange={onChange("description")}
                placeholder="Describe the event"
                rows={6}
                className={TEXTAREA_CLASSNAME}
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
          <Button
            type="submit"
            variant="logout"
            size="lg"
            className="min-w-[190px] rounded-2xl"
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
            className="min-w-[190px] rounded-2xl"
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}