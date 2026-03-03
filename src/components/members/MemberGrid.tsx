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
    <section className="space-y-6">
      {/* Centered section title (standardized like Home "Our Mission") */}
      <div className="text-center">
        <p className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
          {title}:
        </p>
        <div className="mt-2 mx-auto h-px w-full max-w-xl bg-border/70" />
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          <div
            className="
              grid
              gap-4
              justify-center
              grid-cols-[repeat(auto-fit,minmax(280px,1fr))]
            "
          >
            {users.map((u) => (
              <MemberCard key={u.id} user={u} />
            ))}
          </div>
        </div>
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
  const members = ranked.filter((u) => u.role !== "ADMIN");

  return (
    <div className="mt-2 space-y-16">
      <Section title="Leadership" users={admins} />
      <Section title="Membership" users={members} />
    </div>
  );
}