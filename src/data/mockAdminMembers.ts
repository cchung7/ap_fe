export type AdminMemberRow = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  status: "ACTIVE" | "PENDING";
  pointsTotal: number;
  pointsPending: number;
};

export const mockAdminMembers: AdminMemberRow[] = [
  {
    id: "u_001",
    name: "Test X",
    email: "test.x@utdallas.edu",
    role: "ADMIN",
    status: "ACTIVE",
    pointsTotal: 240,
    pointsPending: 0,
  },
  {
    id: "u_002",
    name: "Test 1",
    email: "test.1@utdallas.edu",
    role: "ADMIN",
    status: "ACTIVE",
    pointsTotal: 180,
    pointsPending: 20,
  },
  {
    id: "u_003",
    name: "Test 2",
    email: "test.2@utdallas.edu",
    role: "MEMBER",
    status: "PENDING",
    pointsTotal: 40,
    pointsPending: 60,
  },
  {
    id: "u_004",
    name: "Test 3",
    email: "test.3@utdallas.edu",
    role: "MEMBER",
    status: "ACTIVE",
    pointsTotal: 120,
    pointsPending: 10,
  },
];