// src/types/userWithPoints.ts

import { User } from "./user";
import { UserPoints } from "./userPoints";

// UI-only composite type (JOIN result)
export type UserWithPoints = User & {
  pointsTotal: number;
  pointsPending: number;
};