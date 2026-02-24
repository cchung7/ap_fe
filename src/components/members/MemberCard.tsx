// src/components/members/MemberCard.tsx
import type { UserWithPoints } from "@/types/userWithPoints";

export function MemberCard({ user }: { user: UserWithPoints }) {
  return (
    <div className="rounded-2xl border p-4 bg-card shadow-master">
      <div className="font-black">{user.name}</div>
      <div className="text-sm text-muted-foreground">
        {user.role} · {user.pointsTotal} pts
      </div>
    </div>
  );
}