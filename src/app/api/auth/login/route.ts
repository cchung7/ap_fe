/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/proxy";

import { mockAuthUsers } from "@/data/mockAuthUsers";
import { createMockJwt } from "@/lib/mockJwt";

const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_MOCK_AUTH === "true";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // -----------------------------
    // MOCK AUTH MODE (frontend-only)
    // -----------------------------
    if (USE_MOCK_AUTH) {
      const email = (body?.email || "").toString().trim().toLowerCase();
      const password = (body?.password || "").toString();

      const user = mockAuthUsers.find(
        (u) => u.email.toLowerCase() === email && u.password === password
      );

      if (!user) {
        return NextResponse.json(
          { message: "Invalid email or password (mock auth)" },
          { status: 401 }
        );
      }

      const token = createMockJwt({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subRole: user.subRole,
        status: user.status,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      });

      const res = NextResponse.json(
        {
          message: "Mock login successful",
          role: user.role,
          subRole: user.subRole,
          name: user.name,
          email: user.email,
        },
        { status: 200 }
      );

      res.cookies.set("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
      });

      return res;
    }

    // -----------------------------
    // REAL BACKEND MODE (proxy)
    // -----------------------------
    // ap_be login route is /api/auth/login
    return proxyToBackend(request, "/api/auth/login");
  } catch (error: any) {
    console.error("FE API Route Error (/api/auth/login):", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}