"use client";

import * as React from "react";

import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { HeroSection } from "@/components/home/HeroSection";
import { CarouselSection } from "@/components/home/CarouselSection";

type TopUser = {
  id: string;
  name: string;
  role: string;
  pointsTotal: number;
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

  const [upcomingEvents, setUpcomingEvents] = React.useState<UpcomingEvent[]>([]);
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
            {/* Top Members */}
            <div className="rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-xl p-8 shadow-master">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Preview
                </p>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  Members
                </h2>
                <p className="text-sm text-muted-foreground">Ranking preview.</p>
              </div>

              <div className="mt-6 space-y-3">
                {loadingMembers ? (
                  <div className="rounded-2xl border-2 border-dashed border-border/40 bg-secondary/5 p-8 text-center text-sm text-muted-foreground">
                    Loading members…
                  </div>
                ) : (
                  memberRows.map((u, idx) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between rounded-2xl border border-border/40 bg-secondary/10 px-5 py-4"
                    >
                      <div className="space-y-0.5">
                        <div className="text-sm font-black">
                          #{idx + 1} — {u.name || "-"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {u.role || "-"}
                        </div>
                      </div>
                      <div className="text-sm font-black">
                        {u.name === "-" ? "-" : `${u.pointsTotal ?? 0} pts`}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-xl p-8 shadow-master">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Preview
                </p>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  Upcoming Events
                </h2>
                <p className="text-sm text-muted-foreground">
                  Next three events (published schedule).
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