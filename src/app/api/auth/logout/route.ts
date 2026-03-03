/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/proxy";

const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_MOCK_AUTH === "true";

export async function OPTIONS(request: NextRequest) {
  if (USE_MOCK_AUTH) return new NextResponse(null, { status: 204 });
  return proxyToBackend(request, "/api/auth/logout");
}

export async function POST(req: NextRequest) {
  try {
    if (USE_MOCK_AUTH) {
      const res = NextResponse.json({ message: "Logged out" }, { status: 200 });
      res.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return res;
    }

    return proxyToBackend(req, "/api/auth/logout");
  } catch (error: any) {
    console.error("FE API Route Error (/api/auth/logout):", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}