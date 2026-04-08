"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";
import type {
  AdminEvent,
  EventsApiResponse,
  UpdateEventApiResponse,
  UpdateEventPayload,
} from "../../../_components/eventsShared";
import {
  normalizeDateForInput,
  normalizeTimeForInput,
} from "../../../_components/eventsShared";

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

function mapEventToForm(event: AdminEvent): UpdateEventPayload {
  return {
    title: event.title ?? "",
    category: event.category ?? "VOLUNTEERING",
    date: normalizeDateForInput(event.date),
    startTime: normalizeTimeForInput(event.startTime),
    endTime: normalizeTimeForInput(event.endTime),
    location: event.location ?? "",
    description: event.description ?? "",
    capacity: Number(event.capacity ?? 0),
    pointsValue: Number(event.pointsValue ?? 0),
  };
}

function areEventFormsEqual(a: UpdateEventPayload, b: UpdateEventPayload) {
  return (
    a.title === b.title &&
    a.category === b.category &&
    a.date === b.date &&
    a.startTime === b.startTime &&
    a.endTime === b.endTime &&
    a.location === b.location &&
    a.description === b.description &&
    a.capacity === b.capacity &&
    a.pointsValue === b.pointsValue
  );
}

function getTodayLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function validateEventForm(form: UpdateEventPayload) {
  if (!form.title.trim()) return "Title is required.";
  if (!form.date) return "Date is required.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date)) {
    return "Date must be in YYYY-MM-DD format.";
  }
  if (form.date < getTodayLocalDateString()) {
    return "Date cannot be in the past.";
  }
  if (!form.startTime) return "Start time is required.";
  if (!form.endTime) return "End time is required.";
  if (form.startTime >= form.endTime) {
    return "End time must be later than start time.";
  }
  if (!form.location.trim()) return "Location is required.";
  if (form.capacity <= 0) return "Capacity must be greater than 0.";
  if (form.pointsValue <= 0) return "Points value must be greater than 0.";
  if (!form.description.trim()) return "Please provide a description.";

  return "";
}

export function useEditEventForm() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { showError, showSuccess, clear } = useGlobalStatusBanner();

  const eventId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [form, setForm] = React.useState<UpdateEventPayload>(defaultForm);
  const [initialForm, setInitialForm] =
    React.useState<UpdateEventPayload>(defaultForm);
  const [eventRecord, setEventRecord] = React.useState<AdminEvent | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const fetchEvent = React.useCallback(async () => {
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
        throw new Error("Event not found.");
      }

      const mapped = mapEventToForm(found);

      setEventRecord(found);
      setForm(mapped);
      setInitialForm(mapped);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Failed to fetch event details"
      );
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  React.useEffect(() => {
    void fetchEvent();
  }, [fetchEvent]);

  const setField = React.useCallback(
    <K extends keyof UpdateEventPayload>(
      field: K,
      value: UpdateEventPayload[K]
    ) => {
      clear();
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [clear]
  );

  const onReset = React.useCallback(() => {
    clear();
    setForm(initialForm);
  }, [clear, initialForm]);

  const onCancel = React.useCallback(() => {
    router.push("/admin/events");
  }, [router]);

  const isDirty = !areEventFormsEqual(form, initialForm);
  const isBusy = loading || submitting;

  const onSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!eventId || submitting) return;

      clear();

      const validationError = validateEventForm(form);
      if (validationError) {
        showError(validationError);
        return;
      }

      if (!isDirty) {
        showError("There are no changes to save.");
        return;
      }

      setSubmitting(true);

      const normalizedPayload: UpdateEventPayload = {
        ...form,
        title: form.title.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
      };

      try {
        const res = await fetch(`/api/admin/events/${eventId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(normalizedPayload),
        });

        const json = (await res.json().catch(() => null)) as UpdateEventApiResponse | null;

        if (!res.ok || !json?.success) {
          throw new Error(json?.message || "Failed to update event");
        }

        setForm(normalizedPayload);
        setInitialForm(normalizedPayload);

        showSuccess(json?.message || "Event updated successfully.");

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
    },
    [clear, eventId, form, isDirty, router, showError, showSuccess, submitting]
  );

  return {
    eventId,
    form,
    eventRecord,
    loading,
    submitting,
    loadError,
    isDirty,
    isBusy,
    setField,
    onReset,
    onCancel,
    onSubmit,
    retryLoad: fetchEvent,
  };
}