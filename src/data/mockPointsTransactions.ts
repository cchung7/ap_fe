// src/data/mockPointsTransactions.ts
import type { PointsTransaction } from "@/types/pointsTransaction";

export const mockPointsTransactions: PointsTransaction[] = [
  // Admin One (id: "1")
  {
    id: "tx_1",
    userId: "1",
    delta: 500,
    state: "APPLIED",
    sourceType: "ADMIN_ADJUSTMENT",
    note: "Initial seed points",
    createdAt: new Date().toISOString(),
  },

  // Member One (id: "2")
  {
    id: "tx_2",
    userId: "2",
    delta: 300,
    state: "APPLIED",
    sourceType: "BONUS",
    note: "Welcome bonus",
    createdAt: new Date().toISOString(),
  },
  {
    id: "tx_3",
    userId: "2",
    delta: 20,
    state: "PENDING",
    sourceType: "ATTENDANCE",
    sourceId: "att_1",
    note: "Pending attendance points",
    createdAt: new Date().toISOString(),
  },

  // Member Two (id: "3")
  {
    id: "tx_4",
    userId: "3",
    delta: 120,
    state: "APPLIED",
    sourceType: "ATTENDANCE",
    sourceId: "att_2",
    note: "Event attendance",
    createdAt: new Date().toISOString(),
  },
];