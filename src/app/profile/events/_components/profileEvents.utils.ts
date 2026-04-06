import type {
  AttendanceRow,
  ProfileEventDisplayStatus,
  ProfileEventItem,
} from "./profileEvents.types";

function parseEventDate(date?: string) {
  if (!date) return null;

  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatShortDate(value?: string | Date | null) {
  const date = new Date(value || "");
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatTimeRange(startTime?: string, endTime?: string) {
  if (!startTime || !endTime) return "—";

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

export function formatCategory(category?: string) {
  switch ((category || "").toUpperCase()) {
    case "VOLUNTEERING":
      return "Volunteering";
    case "SOCIAL":
      return "Social";
    case "PROFESSIONAL_DEVELOPMENT":
      return "Professional Development";
    default:
      return category || "—";
  }
}

function getEarnedPoints(row: AttendanceRow) {
  if (row.status !== "CHECKED_IN") return 0;
  return row.pointsAwarded ?? row.event?.pointsValue ?? 0;
}

function getPossiblePoints(row: AttendanceRow) {
  return row.event?.pointsValue ?? 0;
}

function getDisplayStatus(row: AttendanceRow): ProfileEventDisplayStatus {
  if (row.status === "CANCELED") return "CANCELED";
  if (row.status === "CHECKED_IN") return "ATTENDED";
  if (row.status === "REGISTERED") return "UPCOMING";

  return "UPCOMING";
}

export function toProfileEventItem(row: AttendanceRow): ProfileEventItem {
  const eventDate = parseEventDate(row.event?.date);
  const displayStatus = getDisplayStatus(row);

  const isUpcoming =
    row.status === "REGISTERED" && !!eventDate && eventDate.getTime() >= Date.now();

  const isPast = !isUpcoming;

  return {
    id: row.id,
    title: row.event?.title || "Unknown Event",
    categoryLabel: formatCategory(row.event?.category),
    dateLabel: formatShortDate(row.event?.date),
    timeLabel: formatTimeRange(row.event?.startTime, row.event?.endTime),
    locationLabel: row.event?.location || "—",
    registeredAtLabel: formatShortDate(row.registeredAt),
    displayStatus,
    earnedPoints: getEarnedPoints(row),
    possiblePoints: getPossiblePoints(row),
    isUpcoming,
    isPast,
    sortTime: eventDate?.getTime() ?? 0,
  };
}

export function splitAttendanceRows(rows: AttendanceRow[]) {
  const items = rows.map(toProfileEventItem);

  const upcoming = items
    .filter((item) => item.isUpcoming)
    .sort((a, b) => a.sortTime - b.sortTime);

  const past = items
    .filter((item) => item.isPast)
    .sort((a, b) => b.sortTime - a.sortTime);

  return { upcoming, past };
}

export function buildProfileEventSummary(rows: AttendanceRow[]) {
  const items = rows.map(toProfileEventItem);

  return {
    totalEvents: items.length,
    upcomingEvents: items.filter((item) => item.isUpcoming).length,
    checkedInEvents: items.filter((item) => item.displayStatus === "ATTENDED").length,
    totalPoints: items.reduce((sum, item) => sum + item.earnedPoints, 0),
  };
}