import { NextRequest, NextResponse } from "next/server";

const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_MOCK_AUTH === "true";

function decodeMockJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payloadSeg = parts[1];

    let b64 = payloadSeg.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4 !== 0) b64 += "=";

    const json = atob(b64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function redirectToLogin(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("access_token")?.value ?? "";

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthOnlyRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/members");

  if (pathname.startsWith("/events")) {
    return NextResponse.next();
  }

  if (pathname === "/login" || pathname === "/signup") {
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.delete("next");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!isAdminRoute && !isAuthOnlyRoute) {
    return NextResponse.next();
  }

  if (!token) {
    return redirectToLogin(req, pathname);
  }

  if (USE_MOCK_AUTH && isAdminRoute) {
    const payload = decodeMockJwtPayload(token);
    const role = (payload?.role || "").toString();

    if (role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile", "/members", "/login", "/signup"],
};