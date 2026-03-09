// D:\ap_fe\src\app\page.tsx
"use client";

import * as React from "react";

import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { HeroSection } from "@/components/home/HeroSection";
import { CarouselSection } from "@/components/home/CarouselSection";
import { ProfileBadge } from "@/components/ui/ProfileBadge";

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
    const rows = [...upcomingEvents].slice(0, 3);
    while (rows.length < 3) {
      rows.push({
        id: `placeholder_${rows.length}`,
        title: "-",
        date: undefined,
        location: "-",
      });
    }
    return rows;
  }, [upcomingEvents]);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-background">
      <HeroSection />
      <AboutSection />
      <CarouselSection />

      <section className="py-10 px-6 bg-background">
        <div className="container max-w-6xl mx-auto space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Members Leaderboard Section */}
            <div className="rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-xl p-8 shadow-master">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Leaderboard
                </p>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  Members
                </h2>
                
                <p className="text-sm text-muted-foreground font-medium">
                  Recognizing leadership, service, and contributions to the
                  community.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {loadingMembers ? (
                  <div className="rounded-2xl border-2 border-dashed border-border/40 bg-secondary/5 p-8 text-center text-sm text-muted-foreground">
                    Loading members…
                  </div>
                ) : (
                  memberRows.map((u, idx) => {
                    const rank = idx + 1;
                    const isPlaceholder = u.name === "-";

                    const medalBg =
                      rank === 1
                        ? "/backgrounds/medal_gold.png"
                        : rank === 2
                        ? "/backgrounds/medal_silver.png"
                        : "/backgrounds/medal_bronze.png";

                    return (
                      <div
                        key={u.id}
                        className="
                          relative
                          rounded-2xl border border-border/40 bg-secondary/10
                          px-5 py-4
                          overflow-hidden
                        "
                      >
                        {/* Transparent medal background */}
                        <div
                          className="
                            pointer-events-none
                            absolute inset-0
                            rounded-2xl
                            bg-[length:140%_auto]
                            bg-center
                            bg-no-repeat
                            opacity-[0.15]
                          "
                          style={{ backgroundImage: `url('${medalBg}')` }}
                          aria-hidden
                        />

                        {/* Rank */}
                        <div className="absolute left-5 top-4 z-10 text-sm font-black leading-none">
                          #{rank}
                        </div>

                        {/* Points */}
                        <div className="absolute right-5 top-4 z-10 text-sm font-black leading-none whitespace-nowrap">
                          {isPlaceholder ? "—" : `${u.pointsTotal ?? 0} pts`}
                        </div>

                        {/* CONTENT STACK */}
                        <div className="relative z-[1] min-w-0 text-center">
                          <div className="pt-6" />

                          {/* Name (truncate sooner with a mid-boundary safe region) */}
                          <div className="px-6">
                            {isPlaceholder ? (
                              <div
                                className="text-sm text-muted-foreground font-black truncate"
                                title="—"
                              >
                                —
                              </div>
                            ) : (
                              <div
                                className="text-sm font-black truncate"
                                title={u.name}
                              >
                                {u.name}
                              </div>
                            )}
                          </div>

                          {/* Badges */}
                          <div className="mt-3 flex justify-center gap-2 flex-wrap min-h-[28px]">
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

                                {/* Major badge (to the right of academicYear) */}
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
                    );
                  })
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-xl p-8 shadow-master">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Noticeboard
                </p>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  Upcoming Events
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  Supporting connection, leadership, and service through community involvement.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {loadingEvents ? (
                  <div className="rounded-2xl border-2 border-dashed border-border/40 bg-secondary/5 p-8 text-center text-sm text-muted-foreground">
                    Loading events…
                  </div>
                ) : (
                  eventRows.map((e) => (
                    <div
                      key={e.id}
                      className="rounded-2xl border border-border/40 bg-secondary/10 px-5 py-4"
                    >
                      <div className="text-sm font-black">{e.title || "-"}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {safeDateLabel(e.date)} · {e.location || "-"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
}