"use client";

import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { HeroSection } from "@/components/home/HeroSection";

import { mockUsers } from "@/data/mockUsers";
import { mockPointsTransactions } from "@/data/mockPointsTransactions";
import { rankUsers } from "@/lib/userRanking";

import { mockEvents } from "@/data/mockEvents";
import type { Event } from "@/types/events";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function Home() {
  const topMembers = rankUsers(mockUsers, mockPointsTransactions).slice(0, 3);

  const nextEvents: Event[] = [...mockEvents]
    .filter((e) => new Date(e.startsAt).getTime() >= Date.now())
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .slice(0, 3);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-background">
      <HeroSection />
      <AboutSection />

      {/* PREVIEWS (baseline requirement) */}
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
                  Top Members (Points)
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ranking preview (points system is phased).
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {topMembers.map((u, idx) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between rounded-2xl border border-border/40 bg-secondary/10 px-5 py-4"
                  >
                    <div className="space-y-0.5">
                      <div className="text-sm font-black">
                        #{idx + 1} — {u.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {u.role}
                      </div>
                    </div>
                    <div className="text-sm font-black">{u.pointsTotal} pts</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Events */}
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
                {nextEvents.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-border/40 bg-secondary/5 p-8 text-center text-sm text-muted-foreground">
                    No upcoming events yet.
                  </div>
                ) : (
                  nextEvents.map((e) => (
                    <div
                      key={e.id}
                      className="rounded-2xl border border-border/40 bg-secondary/10 px-5 py-4"
                    >
                      <div className="text-sm font-black">{e.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {formatDate(e.startsAt)} · {e.category}
                      </div>
                      {e.location && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {e.location}
                        </div>
                      )}
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