/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/proxy";
import { createMockJwt } from "@/lib/mockJwt";

const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_MOCK_AUTH === "true";

export async function OPTIONS(request: NextRequest) {
  if (USE_MOCK_AUTH) return new NextResponse(null, { status: 204 });
  return proxyToBackend(request, "/api/auth/signup");
}

export async function POST(request: NextRequest) {
  try {
    if (USE_MOCK_AUTH) {
      const raw = await request.json().catch(() => ({}));

      const firstName = (raw?.firstName || "").toString().trim();
      const lastName = (raw?.lastName || "").toString().trim();
      const email = (raw?.email || "").toString().trim().toLowerCase();

      if (!firstName || !lastName || !email) {
        return NextResponse.json(
          { message: "Missing required fields" },
          { status: 400 }
        );
      }

      const token = createMockJwt({
        sub: `mock_user_${Date.now()}`,
        email,
        name: `${firstName} ${lastName}`.trim(),
        role: "MEMBER",
        status: "PENDING",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      });

      const res = NextResponse.json(
        { message: "Mock signup successful" },
        { status: 201 }
      );

      res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
      });

      return res;
    }

    return proxyToBackend(request, "/api/auth/signup");
  } catch (error: any) {
    console.error("FE API Route Error (/api/auth/signup):", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}