// src/data/mockEventAttendance.ts
import type { EventAttendance } from "@/types/eventAttendance";

export const mockEventAttendance: EventAttendance[] = [
  {
    id: "att_1",
    eventId: "event_1",
    userId: "2",
    status: "REGISTERED",
    registeredAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "att_2",
    eventId: "event_1",
    userId: "3",
    status: "CHECKED_IN",
    registeredAt: new Date().toISOString(),
    checkedInAt: new Date().toISOString(),
    pointsAwarded: 20,
    createdAt: new Date().toISOString(),
  },
];
