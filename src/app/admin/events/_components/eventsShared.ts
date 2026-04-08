// D:\ap_fe\src\app\admin\events\_components\eventsShared.ts

export type EventCategory =
  | "VOLUNTEERING"
  | "SOCIAL"
  | "PROFESSIONAL_DEVELOPMENT";

export type AdminEvent = {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description?: string | null;
  capacity: number;
  totalRegistered: number;
  pointsValue: number;
  checkInCode?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminEventDetail = AdminEvent;

export type EventsApiResponse = {
  success?: boolean;
  message?: string;
  data?: AdminEvent[];
};

export type DeleteEventApiResponse = {
  success?: boolean;
  message?: string;
};

export type UpdateEventPayload = {
  title: string;
  category: EventCategory;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  capacity: number;
  pointsValue: number;
};

export type UpdateEventApiResponse = {
  success?: boolean;
  message?: string;
  data?: AdminEvent;
};

export type AttendanceStatus = "REGISTERED" | "CHECKED_IN" | "CANCELED";

export type EventAttendanceUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  subRole?: string | null;
  academicYear?: string | null;
  major?: string | null;
  pointsTotal?: number;
};

export type EventAttendanceItem = {
  id: string;
  status: AttendanceStatus;
  registeredAt?: string;
  checkedInAt?: string | null;
  pointsAwarded?: number;
  user?: EventAttendanceUser | null;
};

export type EventAttendancesPayload = {
  event?: {
    id: string;
    title: string;
  };
  summary?: {
    registered: number;
    checkedIn: number;
    canceled: number;
    total: number;
  };
  attendances?: EventAttendanceItem[];
};

export type EventAttendancesResponse = {
  success?: boolean;
  message?: string;
  data?: EventAttendancesPayload;
};

export function getChicagoDateKey(input: string | Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(input));
}

export function isCompletedEvent(dateIso: string) {
  const eventDay = getChicagoDateKey(dateIso);
  const todayDay = getChicagoDateKey(new Date());
  return eventDay < todayDay;
}

export function formatEventTimeRange(startTime: string, endTime: string) {
  const formatOne = (value: string) => {
    const [hoursRaw, minutes] = value.split(":");
    const hours = Number(hoursRaw);

    if (Number.isNaN(hours) || !minutes) return value;

    const suffix = hours >= 12 ? "PM" : "AM";
    const normalized = hours % 12 || 12;
    return `${normalized}:${minutes} ${suffix}`;
  };

  return `${formatOne(startTime)} - ${formatOne(endTime)}`;
}

export function formatEventCategory(category: EventCategory) {
  switch (category) {
    case "VOLUNTEERING":
      return "Volunteering";
    case "SOCIAL":
      return "Social";
    case "PROFESSIONAL_DEVELOPMENT":
      return "Professional Development";
    default:
      return category;
  }
}

export function getEventCheckInCode(event: Pick<AdminEvent, "checkInCode"> | null) {
  if (!event) return "";
  return event.checkInCode?.trim() ? event.checkInCode : "—";
}

export function getCapacityLabel(event: Pick<AdminEvent, "totalRegistered" | "capacity">) {
  return `${event.totalRegistered}/${event.capacity}`;
}

export function normalizeDateForInput(value: string) {
  if (!value) return "";
  const match = value.match(/^\d{4}-\d{2}-\d{2}/);
  if (match) return match[0];
  return "";
}

export function normalizeTimeForInput(value: string) {
  if (!value) return "";
  const match = value.match(/^\d{2}:\d{2}/);
  if (match) return match[0];
  return value.slice(0, 5);
}