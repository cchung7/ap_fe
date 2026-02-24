// src/types/eventAttendance.ts

export type AttendanceStatus =
  | "REGISTERED"
  | "ATTENDED"
  | "CANCELED"
  | "NO_SHOW";

export type EventAttendance = {
  id: string;

  eventId: string;
  userId: string;

  status: AttendanceStatus;

  // Points logic (ties into PointsTransaction)
  pointsTransactionId?: string;

  registeredAt?: string;
  attendedAt?: string;

  createdAt?: string;
  updatedAt?: string;
};