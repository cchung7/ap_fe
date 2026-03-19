export type AdminMemberAttendancePreview = {
  eventId: string;
  title: string;
  dateLabel: string;
  statusLabel: "Checked In" | "Registered" | "Canceled";
  pointsAwarded: number;
};

export type AdminMemberRow = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  subRole: string;
  academicYear: string;
  major: string;
  pointsTotal: number;
  eventsAttendedCount: number;
  createdAt: string;
  updatedAt: string;
  attendancePreview: AdminMemberAttendancePreview[];
};

export const mockAdminMembers: AdminMemberRow[] = [
  {
    id: "u_001",
    name: "Test X",
    email: "test.x@utdallas.edu",
    role: "ADMIN",
    status: "ACTIVE",
    subRole: "President",
    academicYear: "Senior",
    major: "Computer Science",
    pointsTotal: 240,
    eventsAttendedCount: 12,
    createdAt: "2025-09-02T00:00:00.000Z",
    updatedAt: "2026-03-17T00:00:00.000Z",
    attendancePreview: [
      {
        eventId: "evt_101",
        title: "Spring Volunteer Drive",
        dateLabel: "Mar 10, 2026",
        statusLabel: "Checked In",
        pointsAwarded: 20,
      },
      {
        eventId: "evt_102",
        title: "Leadership Development Workshop",
        dateLabel: "Mar 03, 2026",
        statusLabel: "Checked In",
        pointsAwarded: 15,
      },
      {
        eventId: "evt_103",
        title: "Veteran Networking Mixer",
        dateLabel: "Feb 21, 2026",
        statusLabel: "Checked In",
        pointsAwarded: 10,
      },
    ],
  },
  {
    id: "u_002",
    name: "Test 1",
    email: "test.1@utdallas.edu",
    role: "ADMIN",
    status: "ACTIVE",
    subRole: "Treasurer",
    academicYear: "Junior",
    major: "Finance",
    pointsTotal: 180,
    eventsAttendedCount: 9,
    createdAt: "2025-10-11T00:00:00.000Z",
    updatedAt: "2026-03-15T00:00:00.000Z",
    attendancePreview: [
      {
        eventId: "evt_104",
        title: "Fundraising Kickoff",
        dateLabel: "Mar 12, 2026",
        statusLabel: "Checked In",
        pointsAwarded: 25,
      },
      {
        eventId: "evt_105",
        title: "Community Social Night",
        dateLabel: "Feb 27, 2026",
        statusLabel: "Checked In",
        pointsAwarded: 10,
      },
    ],
  },
  {
    id: "u_003",
    name: "Test 2",
    email: "test.2@utdallas.edu",
    role: "MEMBER",
    status: "PENDING",
    subRole: "",
    academicYear: "Sophomore",
    major: "Information Technology",
    pointsTotal: 40,
    eventsAttendedCount: 2,
    createdAt: "2026-03-09T00:00:00.000Z",
    updatedAt: "2026-03-09T00:00:00.000Z",
    attendancePreview: [
      {
        eventId: "evt_106",
        title: "New Member Orientation",
        dateLabel: "Mar 08, 2026",
        statusLabel: "Registered",
        pointsAwarded: 0,
      },
    ],
  },
  {
    id: "u_004",
    name: "Test 3",
    email: "test.3@utdallas.edu",
    role: "MEMBER",
    status: "ACTIVE",
    subRole: "",
    academicYear: "Graduate",
    major: "Business Analytics",
    pointsTotal: 120,
    eventsAttendedCount: 6,
    createdAt: "2025-11-04T00:00:00.000Z",
    updatedAt: "2026-03-14T00:00:00.000Z",
    attendancePreview: [
      {
        eventId: "evt_107",
        title: "Resume Review Clinic",
        dateLabel: "Mar 11, 2026",
        statusLabel: "Checked In",
        pointsAwarded: 15,
      },
      {
        eventId: "evt_108",
        title: "Volunteer Cleanup Day",
        dateLabel: "Feb 18, 2026",
        statusLabel: "Canceled",
        pointsAwarded: 0,
      },
    ],
  },
  {
    id: "u_005",
    name: "Test 4",
    email: "test.4@utdallas.edu",
    role: "MEMBER",
    status: "SUSPENDED",
    subRole: "",
    academicYear: "Senior",
    major: "Mechanical Engineering",
    pointsTotal: 65,
    eventsAttendedCount: 4,
    createdAt: "2025-12-01T00:00:00.000Z",
    updatedAt: "2026-03-13T00:00:00.000Z",
    attendancePreview: [
      {
        eventId: "evt_109",
        title: "Professional Panel Night",
        dateLabel: "Feb 10, 2026",
        statusLabel: "Checked In",
        pointsAwarded: 10,
      },
    ],
  },
];