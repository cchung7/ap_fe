// Decodes JWT payload, treating expired/invalid tokens as "logged out".
import { NextRequest, NextResponse } from "next/server";

function redirectToLogin(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

    const json = atob(padded);
    const payload = JSON.parse(json) as Record<string, unknown>;

    const exp = payload?.exp;
    if (typeof exp === "number" && Date.now() >= exp * 1000) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
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

  const cookieName = process.env.COOKIE_NAME || "token";
  const token = req.cookies.get(cookieName)?.value ?? "";
  const payload = token ? decodeJwtPayload(token) : null;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthOnlyRoute = pathname.startsWith("/profile");

  if (pathname.startsWith("/events")) {
    return NextResponse.next();
  }

  if (pathname === "/login" || pathname === "/signup") {
    if (payload) {
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

  if (!payload) {
    return redirectToLogin(req, pathname);
  }

  if (isAdminRoute) {
    const role = (payload.role ?? "").toString();

    if (role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.delete("next");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile", "/login", "/signup"],
};