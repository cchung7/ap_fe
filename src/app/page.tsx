"use client";

import * as React from "react";
import { MapPin } from "lucide-react";

import { AboutSection } from "@/components/home/AboutSection";
import { CarouselSection } from "@/components/home/CarouselSection";
import { ContactSection } from "@/components/home/ContactSection";
import { HeroSection } from "@/components/home/HeroSection";

type UpcomingEvent = {
  id: string;
  title: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string | null;
};

function safeDateLabel(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function safeTimeLabel(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function buildEventDateTimeLabel(event: UpcomingEvent) {
  const baseDate = event.date || event.startTime || event.endTime;
  const dateLabel = safeDateLabel(baseDate);

  const startLabel = safeTimeLabel(event.startTime);
  const endLabel = safeTimeLabel(event.endTime);

  let timeLabel = "";
  if (startLabel && endLabel) {
    timeLabel = `${startLabel} - ${endLabel}`;
  } else if (startLabel) {
    timeLabel = startLabel;
  } else if (endLabel) {
    timeLabel = endLabel;
  }

  if (dateLabel !== "-" && timeLabel) return `${dateLabel} · ${timeLabel}`;
  if (dateLabel !== "-") return dateLabel;
  if (timeLabel) return timeLabel;
  return "-";
}

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = React.useState<UpcomingEvent[]>(
    []
  );
  const [loadingEvents, setLoadingEvents] = React.useState(true);

  React.useEffect(() => {
    let alive = true;

    async function runEvents() {
      try {
        setLoadingEvents(true);

        const res = await fetch("/api/events/upcoming?limit=3", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const json = await res.json().catch(() => ({}));
        const list = (json as any)?.data ?? (json as any)?.events ?? [];

        if (!alive) return;
        setUpcomingEvents(Array.isArray(list) ? list : []);
      } catch {
        if (!alive) return;
        setUpcomingEvents([]);
      } finally {
        if (!alive) return;
        setLoadingEvents(false);
      }
    }

    void runEvents();

    return () => {
      alive = false;
    };
  }, []);

  const eventRows = React.useMemo(() => {
    return [...upcomingEvents].slice(0, 3);
  }, [upcomingEvents]);

  return (
    <div className="flex w-full flex-col overflow-hidden bg-background">
      <HeroSection />

      <section className="ui-section-shell">
        <div className="ui-page-shell">
          <div className="ui-section-grid">
            <div className="lg:col-span-5">
              <div className="ui-section-copy">
                <p className="ui-eyebrow text-muted-foreground">Our Purpose</p>

                <h2 className="ui-title">Mission Statement</h2>

                <div className="ui-section-divider" />

                <p className="ui-section-body">
                  Empowering military-connected students and supporters through
                  advocacy, mentorship, and resources that advance academic
                  success, professional development, and community engagement.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="ui-right-module">
                <div className="rounded-[2.25rem] border border-border/50 bg-card/78 p-6 shadow-sm sm:p-7 lg:p-8">
                  <div className="space-y-2 text-center">
                    <p className="ui-eyebrow text-muted-foreground">Upcoming Events</p>
                  </div>

                  <div className="mt-6 space-y-4">
                    {loadingEvents ? (
                      <div className="rounded-2xl border-2 border-dashed border-border/40 bg-background/90 p-10 text-center text-sm text-muted-foreground">
                        Loading events…
                      </div>
                    ) : eventRows.length === 0 ? (
                      <div className="rounded-2xl border border-border/50 bg-card/80 px-6 py-7 text-center shadow-sm">
                        <p className="text-base font-semibold text-foreground">
                          No upcoming events available.
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Please check back soon for future events and updates.
                        </p>
                      </div>
                    ) : (
                      eventRows.map((e) => {
                        const dateTimeLabel = buildEventDateTimeLabel(e);
                        const locationLabel =
                          e.location && e.location.trim() ? e.location : "TBD";

                        return (
                          <div
                            key={e.id}
                            className="rounded-2xl border border-border/50 bg-background/92 px-6 py-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_18px_42px_-24px_rgba(11,18,32,0.14)]"
                          >
                            <div
                              className="text-xl font-black tracking-tight text-foreground"
                              title={e.title || "-"}
                            >
                              {e.title || "-"}
                            </div>

                            <div className="mt-1.75 text-sm font-medium text-muted-foreground">
                              {dateTimeLabel}
                            </div>

                            <div className="mt-1.25 flex justify-center">
                              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="mt-[1px] h-4 w-4 shrink-0 opacity-70" />
                                <span title={locationLabel}>{locationLabel}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />
      <CarouselSection />
      <ContactSection />
    </div>
  );
}