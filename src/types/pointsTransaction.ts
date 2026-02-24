// src/types/pointsTransaction.ts

export type PointsTransactionState =
  | "PENDING"
  | "APPLIED"
  | "REVOKED";

export type PointsSourceType =
  | "ATTENDANCE"
  | "ADMIN_ADJUSTMENT"
  | "BONUS"
  | "PENALTY";

export type PointsTransaction = {
  id: string;

  userId: string;

  // Positive = add points, Negative = subtract points
  delta: number;

  state: PointsTransactionState;

  sourceType: PointsSourceType;

  // Reference to the source record (attendance, admin action, etc.)
  sourceId?: string;

  note?: string;

  createdAt?: string;
  updatedAt?: string;
};