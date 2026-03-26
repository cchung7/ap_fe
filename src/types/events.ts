// src/types/events.ts

export type EventCategory =
  | "VOLUNTEERING"
  | "SOCIAL"
  | "PROFESSIONAL_DEVELOPMENT";

export type EventCurrentStatus = "UPCOMING" | "TODAY" | "PAST";

export type AttendanceStatus = "REGISTERED" | "CHECKED_IN" | "CANCELED";

export type Event = {
  id: string;

  title: string;
  description?: string;

  category: EventCategory;

  startsAt: string; // ISO string
  endsAt?: string; // ISO string

  location?: string;

  capacity?: number;
  totalRegistered?: number;
  pointsValue?: number;

  createdAt?: string;
  updatedAt?: string;

  isRegistered?: boolean;
  viewerAuthenticated?: boolean;
  currentStatus?: EventCurrentStatus;

  attendanceStatus?: AttendanceStatus;
  checkedInAt?: string;
  pointsAwarded?: number;
};