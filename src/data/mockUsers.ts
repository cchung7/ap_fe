// src/data/mockUsers.ts
import { User } from "@/types/user";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin One",
    email: "admin@sva.edu",
    password: "",
    isVerified: true,
    role: "ADMIN",
    status: "ACTIVE",
    subRole: "President",
    major: "Computer Science",
    academicYear: "Graduate",
  },
  {
    id: "2",
    name: "Member One",
    email: "member@sva.edu",
    password: "",
    isVerified: true,
    role: "MEMBER",
    status: "ACTIVE",
    major: "Information Technology and Systems",
    academicYear: "Senior",
  },
  {
    id: "3",
    name: "Member Two",
    email: "member2@sva.edu",
    password: "",
    isVerified: true,
    role: "MEMBER",
    status: "ACTIVE",
    major: "Mechanical Engineering",
    academicYear: "Junior",
  },
];