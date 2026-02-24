// src/types/userPoints.ts

export type UserPoints = {
  userId: string;

  // Derived from PointsTransaction
  pointsTotal: number;    // sum of APPLIED deltas
  pointsPending: number;  // sum of PENDING deltas

  updatedAt?: string;
};