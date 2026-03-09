export const mockAdminRecentActivity = [
  {
    id: "act_001",
    activityType: "USER_REGISTERED",
    description: "A new member account was created and is pending approval.",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: "act_002",
    activityType: "EVENT_CREATED",
    description: "An upcoming volunteering event was created by admin.",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "act_003",
    activityType: "USER_CHECKED_IN",
    description: "A member check-in was recorded for a recent event.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "act_004",
    activityType: "EVENT_UPDATED",
    description: "An event schedule was updated with a new start time.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
  },
  {
    id: "act_005",
    activityType: "GENERAL",
    description: "Admin dashboard data was reviewed.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
];