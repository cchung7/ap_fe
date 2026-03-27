// D:\ap_fe\src\types\admin.ts

export type AdminMemberRole = "ADMIN" | "MEMBER";
export type AdminMemberStatus = "ACTIVE" | "PENDING" | "SUSPENDED";
export type AdminAttendancePreviewStatusLabel =
  | "Checked In"
  | "Registered"
  | "Canceled";

export type AdminMemberAttendancePreviewItem = {
  eventId: string;
  title: string;
  dateLabel: string;
  statusLabel: AdminAttendancePreviewStatusLabel;
  pointsAwarded: number;
};

export type AdminMemberRow = {
  id: string;
  name: string;
  email: string;

  role: AdminMemberRole;
  subRole?: string | null;
  status: AdminMemberStatus;

  academicYear?: string | null;
  major?: string | null;
  profileImageUrl?: string | null;

  pointsTotal: number;
  eventsAttendedCount: number;
  attendancePreview: AdminMemberAttendancePreviewItem[];

  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type AdminDashboardActivity = {
  id?: string | number;
  activityType?: string;
  description?: string;
  createdAt?: string | Date;
};

export type AdminDashboardEvent = {
  id: string;
  title: string;
  category?: string;
  date?: string | Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  totalRegistered?: number;
  pointsValue?: number;
};

export type AdminDashboardResponse = {
  members?: AdminMemberRow[];
  events?: AdminDashboardEvent[];
  activities?: AdminDashboardActivity[];
};