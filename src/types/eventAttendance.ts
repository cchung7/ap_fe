// src/types/eventAttendance.ts

export type AttendanceStatus =
  | "REGISTERED"
  | "CHECKED_IN"
  | "CANCELED";

export type EventAttendance = {
  id: string;

  eventId: string;
  userId: string;

  status: AttendanceStatus;

  registeredAt?: string;
  checkedInAt?: string;
  pointsAwarded?: number;

  createdAt?: string;
  updatedAt?: string;
};