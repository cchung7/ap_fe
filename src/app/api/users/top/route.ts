// D:\ap_fe\src\app\api\users\top\route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/proxy";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const res = await proxyToBackend(request, "/api/users/top");

  // Force no-cache all the way to the browser/CDN
  const headers = new Headers(res.headers);
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  headers.set("Pragma", "no-cache");
  headers.set("Expires", "0");

  return new NextResponse(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}