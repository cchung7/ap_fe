import { NextRequest, NextResponse } from "next/server";

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

  const cookieName = process.env.COOKIE_NAME || "token";
  const token = req.cookies.get(cookieName)?.value ?? "";

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthOnlyRoute = pathname.startsWith("/profile");

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

  if (!isAdminRoute && !isAuthOnlyRoute) return NextResponse.next();

  if (!token) return redirectToLogin(req, pathname);

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile", "/login", "/signup"],
};