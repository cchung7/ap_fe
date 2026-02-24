/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

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

      // Put role in JWT payload so middleware can gate /admin
      const token = createMockJwt({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subRole: user.subRole,
        status: user.status,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1h
      });

      const nextResponse = NextResponse.json(
        {
          message: "Mock login successful",
          role: user.role,
          subRole: user.subRole,
          name: user.name,
          email: user.email,
        },
        { status: 200 }
      );

      nextResponse.cookies.set("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
      });

      return nextResponse;
    }

    // -----------------------------
    // REAL BACKEND MODE (Phase II)
    // -----------------------------
    const response = await fetch("https://api.jayportfolio.me/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const backendCookies = response.headers.get("set-cookie");

    let token = data.access_token || data.token;

    if (!token && backendCookies) {
      const match = backendCookies.match(/access_token=([^;]+)/);
      if (match) token = match[1];
    }

    const nextResponse = NextResponse.json(data, { status: 200 });

    if (token) {
      nextResponse.cookies.set("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
      });
    }

    return nextResponse;
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}