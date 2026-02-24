// src/components/members/MemberGrid.tsx
import type { User } from "@/types/user";
import type { PointsTransaction } from "@/types/pointsTransaction";
import { rankUsers } from "@/lib/userRanking";
import { MemberCard } from "./MemberCard";

function Section({
  title,
  users,
}: {
  title: string;
  users: ReturnType<typeof rankUsers>;
}) {
  if (users.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="text-xs font-black uppercase tracking-[0.25em] text-muted-foreground">
        {title}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => (
          <MemberCard key={u.id} user={u} />
        ))}
      </div>
    </section>
  );
}

export function MemberGrid({
  users,
  txs,
}: {
  users: User[];
  txs: PointsTransaction[];
}) {
  const ranked = rankUsers(users, txs);

  const admins = ranked.filter((u) => u.role === "ADMIN");

  // Pending: prefer status signal; if legacy isVerified exists, treat false as pending
  const pending = ranked.filter(
    (u) =>
      u.role !== "ADMIN" &&
      (u.status === "PENDING" || u.isVerified === false)
  );

  const verified = ranked.filter(
    (u) =>
      u.role !== "ADMIN" &&
      u.status !== "PENDING" &&
      u.isVerified !== false
  );

  return (
    <div className="space-y-10">
      <Section title="Admins" users={admins} />
      <Section title="Pending Members" users={pending} />
      <Section title="Verified Members" users={verified} />
    </div>
  );
}