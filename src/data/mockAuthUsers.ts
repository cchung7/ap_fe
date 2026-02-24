// src/data/mockAuthUsers.ts
export type MockAuthRole = "ADMIN" | "MEMBER";

export type MockAuthUser = {
  id: string;
  name: string;
  email: string;
  password: string; // plain text ONLY for local mock auth
  role: MockAuthRole;

  // optional future seam
  subRole?: string;
  status?: "ACTIVE" | "PENDING";
};

export const mockAuthUsers: MockAuthUser[] = [
  {
    id: "mock_admin_1",
    name: "Dummy Admin",
    email: "admin@sva-utdallas.org",
    password: "Admin123!",
    role: "ADMIN",
    subRole: "PRESIDENT",
    status: "ACTIVE",
  },
  {
    id: "mock_user_1",
    name: "Dummy Member",
    email: "member@sva-utdallas.org",
    password: "Member123!",
    role: "MEMBER",
    status: "ACTIVE",
  },
];