export type AttendanceStatus = "REGISTERED" | "CHECKED_IN" | "CANCELED";

export type AttendanceRow = {
  id: string;
  status: AttendanceStatus;
  registeredAt?: string;
  checkedInAt?: string | null;
  pointsAwarded?: number;
  event?: {
    id: string;
    title: string;
    category: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    description?: string | null;
    pointsValue?: number;
  } | null;
};

export type AttendancesResponse = {
  success?: boolean;
  message?: string;
  data?: AttendanceRow[];
};

export type ProfileEventDisplayStatus =
  | "UPCOMING"
  | "ATTENDED"
  | "CANCELED";

export type ProfileEventItem = {
  id: string;
  title: string;
  categoryLabel: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
  registeredAtLabel: string;
  displayStatus: ProfileEventDisplayStatus;
  earnedPoints: number;
  possiblePoints: number;
  isUpcoming: boolean;
  isPast: boolean;
  sortTime: number;
};