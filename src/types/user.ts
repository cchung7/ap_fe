// src/types/user.ts

export type UserRole = "ADMIN" | "MEMBER";
export type UserStatus = "ACTIVE" | "PENDING";

export type User = {
  id: string;

  name: string;
  email: string;
  password: string; // required for auth

  profileImage?: string;

  isVerified: boolean;

  role: UserRole;
  status: UserStatus;

  createdAt?: string;
  updatedAt?: string;
};