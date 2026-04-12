import { MemberCard } from "./MemberCard";

type DirectoryUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  subRole?: string | null;
  status?: string | null;
  pointsTotal?: number | null;
  academicYear?: string | null;
  major?: string | null;
  profileImageUrl?: string | null;
};

function isVisibleDirectoryUser(user: DirectoryUser) {
  const status = String(user.status || "").toUpperCase();
  return status !== "PENDING" && status !== "SUSPENDED";
}

function Section({
  title,
  users,
  isLeadership = false,
}: {
  title: string;
  users: DirectoryUser[];
  isLeadership?: boolean;
}) {
  if (users.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="ui-title text-3xl md:text-4xl lg:text-5xl">
          {title}:
        </h2>
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
              <MemberCard
                key={u.id}
                user={u as any}
                isLeadership={isLeadership}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function MemberGrid({ users }: { users: DirectoryUser[] }) {
  const visibleUsers = (Array.isArray(users) ? users : []).filter(
    isVisibleDirectoryUser
  );

  const ranked = [...visibleUsers].sort((a, b) => {
    const ap = Number(a?.pointsTotal ?? 0);
    const bp = Number(b?.pointsTotal ?? 0);
    return bp - ap;
  });

  const admins = ranked.filter((u) => u.role === "ADMIN");
  const members = ranked.filter((u) => u.role !== "ADMIN");

  return (
    <div className="mt-2 space-y-16">
      <Section title="Leadership" users={admins} isLeadership />
      <Section title="Membership" users={members} />
    </div>
  );
}