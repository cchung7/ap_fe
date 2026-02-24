// src/app/members/page.tsx
import { MemberGrid } from "@/components/members/MemberGrid";
import { mockUsers } from "@/data/mockUsers";
import { mockPointsTransactions } from "@/data/mockPointsTransactions";

export default function MembersPage() {
  return (
    <div className="container max-w-7xl mx-auto py-12 space-y-6">
      <h1>
        All Members
      </h1>
      <MemberGrid users={mockUsers} txs={mockPointsTransactions} />
    </div>
  );
}