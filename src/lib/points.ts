// src/lib/points.ts
import type { PointsTransaction } from "@/types/pointsTransaction";

export type UserPointsSummary = {
  pointsTotal: number; // sum of APPLIED deltas
  pointsPending: number; // sum of PENDING deltas
};

export function getUserPointsSummary(
  userId: string,
  txs: PointsTransaction[]
): UserPointsSummary {
  let pointsTotal = 0;
  let pointsPending = 0;

  for (const tx of txs) {
    if (tx.userId !== userId) continue;

    if (tx.state === "APPLIED") pointsTotal += tx.delta;
    if (tx.state === "PENDING") pointsPending += tx.delta;
  }

  return { pointsTotal, pointsPending };
}