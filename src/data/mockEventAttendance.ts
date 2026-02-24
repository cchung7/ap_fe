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
    status: "ATTENDED",
    registeredAt: new Date().toISOString(),
    attendedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];