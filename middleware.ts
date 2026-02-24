import { NextRequest, NextResponse } from "next/server";

const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_MOCK_AUTH === "true";

function decodeMockJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payloadSeg = parts[1];

    // base64url -> base64
    let b64 = payloadSeg.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4 !== 0) b64 += "=";

    const json = atob(b64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only gate /admin (and nested routes)
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("access_token")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // In mock mode, we can decode the role directly from the token payload
  if (USE_MOCK_AUTH) {
    const payload = decodeMockJwtPayload(token);
    const role = (payload?.role || "").toString();
    if (role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Real backend mode:
  // We can't safely verify JWT in edge without keys; rely on backend route guards later.
  // Minimal behavior: if token exists, allow. Your server should still enforce admin.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};