// D:\ap_fe\src\components\members\MemberGrid.tsx
import type { User } from "@/types/user";
import { MemberCard } from "./MemberCard";

function Section({
  title,
  users,
}: {
  title: string;
  users: User[];
}) {
  if (users.length === 0) return null;

  return (
    <section className="space-y-6">
      {/* Centered section title */}
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
              <MemberCard key={u.id} user={u as any} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function MemberGrid({ users }: { users: User[] }) {
  const ranked = [...(Array.isArray(users) ? users : [])].sort((a: any, b: any) => {
    const ap = Number(a?.pointsTotal ?? 0);
    const bp = Number(b?.pointsTotal ?? 0);
    return bp - ap;
  });

  const admins = ranked.filter((u: any) => u.role === "ADMIN");
  const members = ranked.filter((u: any) => u.role !== "ADMIN");

  return (
    <div className="mt-2 space-y-16">
      <Section title="Leadership" users={admins as any} />
      <Section title="Membership" users={members as any} />
    </div>
  );
}