"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import AdminHeader from "../_components/AdminHeader/AdminHeader";

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
  category: "VOLUNTEERING" | "SOCIAL" | "PROFESSIONAL_DEVELOPMENT";
  createdAt: string;
  updatedAt: string;
};

type EventsApiResponse = {
  success?: boolean;
  message?: string;
  data?: AdminEvent[];
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
  return "PUBLISHED";
}

export default function AdminEventsPage() {
  const router = useRouter();

  const [events, setEvents] = React.useState<AdminEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
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

        if (!cancelled) {
          setEvents(Array.isArray(json.data) ? json.data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to fetch events");
          setEvents([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Events"
        subtitle="Create, publish, and track event attendance + points"
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
          className="overflow-hidden rounded-[2.5rem] border border-border/60 bg-secondary/10"
        >
          <div className="border-b border-border/50 p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground/70">
              Events Table
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Create and review real event records from the backend.
            </p>
          </div>

          <div className="overflow-x-auto p-6">
            {loading ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                Loading events...
              </div>
            ) : error ? (
              <div className="py-10 text-center text-sm text-destructive">
                {error}
              </div>
            ) : events.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                No events found.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                  <tr className="border-b border-border/40">
                    <th className="py-3 pr-4 text-left font-black">Title</th>
                    <th className="py-3 pr-4 text-left font-black">Date</th>
                    <th className="py-3 pr-4 text-left font-black">Status</th>
                    <th className="py-3 pl-4 text-right font-black">
                      Points Award
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-border/30 last:border-b-0"
                    >
                      <td className="py-4 pr-4 font-bold">{e.title}</td>
                      <td className="py-4 pr-4 text-muted-foreground">
                        {new Date(e.date).toLocaleString()}
                      </td>
                      <td className="py-4 pr-4 font-black">
                        {getEventStatus(e.date)}
                      </td>
                      <td className="py-4 pl-4 text-right font-black">
                        {e.pointsValue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}