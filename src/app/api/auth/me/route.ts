// D:\ap_fe\src\app\api\auth\me\route.ts
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";

export async function OPTIONS(request: NextRequest) {
  return proxyToBackend(request, "/api/auth/me");
}

export async function GET(request: NextRequest) {
  return proxyToBackend(request, "/api/auth/me");
}