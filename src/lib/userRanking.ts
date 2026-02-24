// src/lib/userRanking.ts
import type { User } from "@/types/user";
import type { UserWithPoints } from "@/types/userWithPoints";
import type { PointsTransaction } from "@/types/pointsTransaction";
import { getUserPointsSummary } from "@/lib/points";

export function rankUsers(
  users: User[],
  txs: PointsTransaction[]
): UserWithPoints[] {
  const withPoints: UserWithPoints[] = users.map((u) => {
    const summary = getUserPointsSummary(u.id, txs);
    return { ...u, ...summary };
  });

  return [...withPoints].sort((a, b) => {
    // 1. Role priority
    if (a.role !== b.role) {
      return a.role === "ADMIN" ? -1 : 1;
    }

    // 2. Points (descending)
    return b.pointsTotal - a.pointsTotal;
  });
}