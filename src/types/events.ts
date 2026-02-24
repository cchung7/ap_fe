// src/types/events.ts

export type EventCategory = "VOLUNTEERING" | "SOCIAL" | "PROFESSIONAL_DEVELOPMENT";

export type Event = {
  id: string;

  title: string;
  description?: string;

  category: EventCategory;

  startsAt: string; // ISO string
  endsAt?: string;  // ISO string

  location?: string;

  capacity?: number;

  createdAt?: string;
  updatedAt?: string;
};