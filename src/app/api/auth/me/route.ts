/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const BACKEND_ME_URL = "https://api.jayportfolio.me/auth/me";
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_MOCK_AUTH === "true";

type MockMe = {
  sub?: string;
  email?: string;
  name?: string;
  role?: string;
  subRole?: string;
  status?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
};

function base64UrlDecodeToJson<T = any>(segment: string): T {
  // Convert base64url -> base64
  let b64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  // Pad with "="
  while (b64.length % 4 !== 0) b64 += "=";

  const json = Buffer.from(b64, "base64").toString("utf8");
  return JSON.parse(json) as T;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;

    // -----------------------------
    // MOCK AUTH MODE (frontend-only)
    // -----------------------------
    if (USE_MOCK_AUTH) {
      if (!token) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
      }

      // Token is header.payload.signature; we only need payload
      const parts = token.split(".");
      if (parts.length < 2) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }

      const payload = base64UrlDecodeToJson<MockMe>(parts[1]);

      // Optional: basic exp check (avoid “stuck logged in” with expired mock token)
      const now = Math.floor(Date.now() / 1000);
      if (typeof payload.exp === "number" && payload.exp < now) {
        const res = NextResponse.json({ message: "Session expired" }, { status: 401 });
        // Clear cookie if expired
        res.cookies.set("access_token", "", { path: "/", maxAge: 0 });
        return res;
      }

      return NextResponse.json(payload, { status: 200 });
    }

    // -----------------------------
    // REAL BACKEND MODE (Phase II)
    // -----------------------------
    const response = await fetch(BACKEND_ME_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("API Route Error (/api/auth/me):", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}