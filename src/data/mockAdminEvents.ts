export type AdminEventRow = {
  id: string;
  title: string;
  date: string; // ISO string
  status: "DRAFT" | "PUBLISHED" | "COMPLETED";
  pointsAward: number;
};

export const mockAdminEvents: AdminEventRow[] = [
  {
    id: "e_101",
    title: "Welcome Mixer",
    date: "2026-03-10T18:00:00.000Z",
    status: "PUBLISHED",
    pointsAward: 20,
  },
  {
    id: "e_102",
    title: "Volunteer Service Day",
    date: "2026-03-22T15:00:00.000Z",
    status: "DRAFT",
    pointsAward: 40,
  },
  {
    id: "e_103",
    title: "Career Workshop",
    date: "2026-02-12T19:00:00.000Z",
    status: "COMPLETED",
    pointsAward: 30,
  },
];