"use client";

import { useAuthContext } from "@/components/auth/AuthProvider";

export function useMe() {
  return useAuthContext();
}