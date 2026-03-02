// src/app/members/page.tsx
import { MemberGrid } from "@/components/members/MemberGrid";
import { mockUsers } from "@/data/mockUsers";
import { mockPointsTransactions } from "@/data/mockPointsTransactions";

export default function MembersPage() {
  return (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 pt-32 pb-10 sm:px-6 sm:pt-36 sm:pb-12 lg:px-8 space-y-10">
        {/* Header (centered) */}
        <header className="space-y-2 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-primary">
            Our Members
          </h1>
          <div className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Leadership and members of the Student Veterans Association, organized
            by role and participation.
          </div>
        </header>

        {/* Centered content width (matches Events layout behavior) */}
        <div className="max-w-6xl mx-auto w-full">
          <MemberGrid users={mockUsers} txs={mockPointsTransactions} />
        </div>
      </div>
    </div>
  );
}