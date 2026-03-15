// D:\ap_fe\src\app\page.tsx
"use client";

import * as React from "react";

import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { HeroSection } from "@/components/home/HeroSection";
import { CarouselSection } from "@/components/home/CarouselSection";
import { ProfileBadge } from "@/components/ui/ProfileBadge";
import { MapPin } from "lucide-react";

type TopUser = {
  id: string;
  name: string;
  role: string;
  pointsTotal: number;
  subRole?: string | null;
  academicYear?: string | null;
  major?: string | null;
};

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
  const [topMembers, setTopMembers] = React.useState<TopUser[]>([]);
  const [loadingMembers, setLoadingMembers] = React.useState(true);

  const [upcomingEvents, setUpcomingEvents] = React.useState<UpcomingEvent[]>(
    []
  );
  const [loadingEvents, setLoadingEvents] = React.useState(true);

  React.useEffect(() => {
    let alive = true;

    async function runMembers() {
      try {
        setLoadingMembers(true);
        const res = await fetch("/api/users/top?limit=3", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const json = await res.json().catch(() => ({}));
        const list = (json as any)?.data ?? (json as any)?.users ?? [];

        if (!alive) return;
        setTopMembers(Array.isArray(list) ? list : []);
      } catch {
        if (!alive) return;
        setTopMembers([]);
      } finally {
        if (!alive) return;
        setLoadingMembers(false);
      }
    }

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

    runMembers();
    runEvents();

    return () => {
      alive = false;
    };
  }, []);

  const memberRows = React.useMemo(() => {
    const rows = [...topMembers].slice(0, 3);
    while (rows.length < 3) {
      rows.push({
        id: `placeholder_${rows.length}`,
        name: "-",
        role: "-",
        pointsTotal: 0,
        subRole: null,
        academicYear: null,
        major: null,
      });
    }
    return rows;
  }, [topMembers]);

  const eventRows = React.useMemo(() => {
    return [...upcomingEvents].slice(0, 3);
  }, [upcomingEvents]);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-background">
      <HeroSection />

      {/* Leaderboard — supporting module for Our Mission */}
      <section className="px-6 pt-8 md:pt-10 bg-background">
        <div className="container max-w-6xl mx-auto">
          <div className="ui-surface-brand mx-auto w-full max-w-[30rem] rounded-[2rem] p-5 sm:p-6 md:p-7">
            <div className="relative z-10">
              <div className="space-y-2 text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">
                  Leaderboard
                </p>
                <h2 className="text-2xl md:text-[1.65rem] font-black tracking-tight text-foreground">
                  Featured Members
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  Recognizing leadership, service, and contributions to the
                  community.
                </p>
              </div>

              <div className="mt-5 space-y-3">
                {loadingMembers ? (
                  <div className="rounded-2xl border-2 border-dashed border-border/40 bg-background/94 p-8 text-center text-sm text-muted-foreground">
                    Loading members…
                  </div>
                ) : (
                  memberRows.map((u, idx) => {
                    const rank = idx + 1;
                    const isPlaceholder = u.name === "-";

                    const rowTone =
                      rank === 1
                        ? "border-yellow-500/20 bg-yellow-500/[0.08]"
                        : rank === 2
                        ? "border-slate-400/20 bg-slate-400/[0.10]"
                        : "border-amber-700/20 bg-amber-700/[0.08]";

                    const rankTone =
                      rank === 1
                        ? "border-yellow-700/30 bg-yellow-500/15 text-foreground"
                        : rank === 2
                        ? "border-slate-600/30 bg-slate-400/15 text-foreground"
                        : "border-amber-800/30 bg-amber-700/15 text-foreground";

                    const pointsTone = "text-foreground";

                    return (
                      <div
                        key={u.id}
                        className={[
                          "rounded-2xl border px-4 py-4 sm:px-5",
                          "backdrop-blur-md transition-all duration-300",
                          "hover:border-accent/35 hover:-translate-y-0.5",
                          "shadow-[0_8px_24px_rgba(11,18,32,0.04)]",
                          rowTone,
                        ].join(" ")}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div
                            className={[
                              "shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full border",
                              "text-sm font-black tracking-tight",
                              rankTone,
                            ].join(" ")}
                          >
                            #{rank}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                {isPlaceholder ? (
                                  <div
                                    className="truncate text-base sm:text-lg font-black tracking-tight text-muted-foreground"
                                    title="—"
                                  >
                                    —
                                  </div>
                                ) : (
                                  <div
                                    className="truncate text-base sm:text-lg font-black tracking-tight text-foreground"
                                    title={u.name}
                                  >
                                    {u.name}
                                  </div>
                                )}
                              </div>

                              <div className="shrink-0 text-right">
                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                                  Points
                                </p>
                                <p
                                  className={[
                                    "text-sm sm:text-base font-black tracking-tight",
                                    isPlaceholder
                                      ? "text-muted-foreground"
                                      : pointsTone,
                                  ].join(" ")}
                                >
                                  {isPlaceholder ? "—" : `${u.pointsTotal ?? 0}`}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2 min-h-[28px]">
                              {isPlaceholder ? (
                                <span className="text-xs text-muted-foreground">
                                  &nbsp;
                                </span>
                              ) : (
                                <>
                                  {u.subRole && (
                                    <ProfileBadge variant="subRole">
                                      {u.subRole}
                                    </ProfileBadge>
                                  )}

                                  {u.academicYear && (
                                    <ProfileBadge variant="academicYear">
                                      {u.academicYear}
                                    </ProfileBadge>
                                  )}

                                  {u.major && (
                                    <ProfileBadge variant="major" title={u.major}>
                                      {u.major}
                                    </ProfileBadge>
                                  )}
                                </>
                              )}
                            </div>
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
      </section>

      <AboutSection />

      {/* Noticeboard — supporting module for Our Vision */}
      <section className="py-10 px-6 bg-background">
        <div className="container max-w-6xl mx-auto">
          <div className="ui-surface-brand mx-auto w-full max-w-[30rem] rounded-[2.5rem] p-8">
            <div className="relative z-10">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Noticeboard
                </p>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  Upcoming Events
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  Supporting connection, leadership, and service through community
                  involvement.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {loadingEvents ? (
                  <div className="rounded-2xl border-2 border-dashed border-border/40 bg-background/94 p-8 text-center text-sm text-muted-foreground">
                    Loading events…
                  </div>
                ) : eventRows.length === 0 ? (
                  <div className="ui-surface-accent rounded-2xl px-5 py-6 text-center">
                    <p className="relative z-10 text-sm font-semibold text-foreground">
                      No upcoming events available.
                    </p>
                    <p className="relative z-10 mt-1 text-xs text-muted-foreground">
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
                        className="ui-surface-accent rounded-2xl px-5 py-4 transition-all duration-300 hover:border-accent/35 hover:-translate-y-0.5"
                      >
                        <div
                          className="relative z-10 truncate text-base sm:text-lg font-black tracking-tight text-foreground"
                          title={e.title || "-"}
                        >
                          {e.title || "-"}
                        </div>

                        <div className="relative z-10 mt-1 text-xs sm:text-sm font-medium text-muted-foreground">
                          {dateTimeLabel}
                        </div>

                        <div className="relative z-10 mt-2 flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                          <MapPin className="mt-[1px] h-3.5 w-3.5 shrink-0 opacity-70" />
                          <span className="min-w-0 truncate" title={locationLabel}>
                            {locationLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CarouselSection />
      <ContactSection />
    </div>
  );
}