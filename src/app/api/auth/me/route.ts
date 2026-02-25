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
  let b64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4 !== 0) b64 += "=";
  return JSON.parse(Buffer.from(b64, "base64").toString("utf8")) as T;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("access_token")?.value;

    // -----------------------------
    // MOCK AUTH MODE (frontend-only)
    // -----------------------------
    if (USE_MOCK_AUTH) {
      if (!token) {
        return NextResponse.json({ me: null }, { status: 200 });
      }

      const parts = token.split(".");
      if (parts.length < 2) {
        return NextResponse.json({ me: null }, { status: 200 });
      }

      const payload = base64UrlDecodeToJson<MockMe>(parts[1]);

      // Optional exp check
      const now = Math.floor(Date.now() / 1000);
      if (typeof payload.exp === "number" && payload.exp < now) {
        const res = NextResponse.json({ me: null }, { status: 200 });
        res.cookies.set("access_token", "", { path: "/", maxAge: 0 });
        return res;
      }

      return NextResponse.json({ me: payload }, { status: 200 });
    }

    // -----------------------------
    // REAL BACKEND MODE
    // -----------------------------
    if (!token) {
      return NextResponse.json({ me: null }, { status: 200 });
    }

    const response = await fetch(BACKEND_ME_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Backend says unauthenticated → normalize to 200
      return NextResponse.json({ me: null }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json({ me: data }, { status: 200 });

  } catch (error: any) {
    console.error("API Route Error (/api/auth/me):", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}