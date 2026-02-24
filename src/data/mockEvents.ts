// src/data/mockEvents.ts
import type { Event } from "@/types/events";

export const mockEvents: Event[] = [
  {
    id: "evt_001",
    title: "Campus Volunteer Outreach",
    category: "VOLUNTEERING",
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    endsAt: new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 90
    ).toISOString(),
    location: "UT Dallas – Student Union",
    capacity: 40,
    description:
      "Volunteer service block supporting campus partners. Attendance-based points will be enabled later.",
  },
  {
    id: "evt_002",
    title: "SVA Social Night",
    category: "SOCIAL",
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    location: "Richardson – Community Lounge",
    capacity: 60,
    description:
      "Community-building event for members and supporters. Networking encouraged.",
  },
  {
    id: "evt_003",
    title: "Resume & Interview Workshop",
    category: "PROFESSIONAL_DEVELOPMENT",
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    location: "UT Dallas – ECSW 1.315",
    capacity: 80,
    description:
      "Skill-building workshop focused on resume reviews, interviewing, and readiness.",
  },
  {
    id: "evt_004",
    title: "Veterans Community Service Day",
    category: "VOLUNTEERING",
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(),
    location: "Dallas – Partner Organization Site",
    capacity: 50,
    description:
      "Large volunteer day with community partners. Exact details posted closer to date.",
  },
];