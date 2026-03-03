/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/proxy";

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

function unwrapMePayload(raw: any): { me: any } {
  // Accept either:
  // 1) { me: ... }
  // 2) { data: { me: ... } } (BE sendResponse)
  // 3) { data: ... } where data is the user object (fallback)
  if (raw && typeof raw === "object") {
    if ("me" in raw) return { me: (raw as any).me ?? null };
    if ("data" in raw) {
      const d = (raw as any).data;
      if (d && typeof d === "object" && "me" in d) return { me: d.me ?? null };
      // last-resort fallback: treat data as the user object
      return { me: d ?? null };
    }
  }
  return { me: null };
}

export async function OPTIONS(request: NextRequest) {
  if (USE_MOCK_AUTH) return new NextResponse(null, { status: 204 });
  return proxyToBackend(request, "/api/auth/me");
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (USE_MOCK_AUTH) {
      if (!token) return NextResponse.json({ me: null }, { status: 200 });

      const parts = token.split(".");
      if (parts.length < 2)
        return NextResponse.json({ me: null }, { status: 200 });

      const payload = base64UrlDecodeToJson<MockMe>(parts[1]);

      const now = Math.floor(Date.now() / 1000);
      if (typeof payload.exp === "number" && payload.exp < now) {
        const res = NextResponse.json({ me: null }, { status: 200 });
        res.cookies.set("token", "", { path: "/", maxAge: 0 });
        return res;
      }

      return NextResponse.json({ me: payload }, { status: 200 });
    }

    // REAL BACKEND MODE:
    // We normalize BE response so frontend always gets { me: ... }
    const beRes = await proxyToBackend(request, "/api/auth/me");

    const text = await beRes.text().catch(() => "");
    let parsed: any = {};
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      parsed = {};
    }

    const normalized = unwrapMePayload(parsed);

    // Keep status = 200 for optional auth,
    // but if backend returns non-2xx, preserve it.
    const out = NextResponse.json(normalized, { status: beRes.status });

    // Forward set-cookie if any (proxy already does, but we're creating a new response)
    const setCookie = beRes.headers.get("set-cookie");
    if (setCookie) out.headers.set("set-cookie", setCookie);

    return out;
  } catch (error: any) {
    console.error("FE API Route Error (/api/auth/me):", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}