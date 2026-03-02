import { NextRequest, NextResponse } from "next/server";

export function getBackendBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    "http://localhost:4000"
  );
}

export async function proxyToBackend(req: NextRequest, backendPath: string) {
  const beBase = getBackendBaseUrl();

  // Forward query params (from FE request URL)
  const incomingUrl = new URL(req.url);
  const beUrl = new URL(`${beBase}${backendPath}`);
  incomingUrl.searchParams.forEach((v, k) => beUrl.searchParams.set(k, v));

  const contentType = req.headers.get("content-type") || "";
  const hasJsonBody = contentType.includes("application/json");

  const cookieHeader = req.headers.get("cookie") || "";

  const init: RequestInit = {
    method: req.method,
    headers: {
      ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    cache: "no-store",
  };

  // Read body only for methods that can have one
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (hasJsonBody) {
      const body = await req.json().catch(() => undefined);
      init.body = body !== undefined ? JSON.stringify(body) : undefined;
    } else {
      // If you later support multipart/form-data, handle here.
      const text = await req.text().catch(() => "");
      init.body = text || undefined;
    }
  }

  const beRes = await fetch(beUrl.toString(), init);
  const raw = await beRes.text();

  const out = new NextResponse(raw, { status: beRes.status });

  // Forward Set-Cookie (important for /auth/login and /auth/logout)
  const setCookie = beRes.headers.get("set-cookie");
  if (setCookie) out.headers.set("set-cookie", setCookie);

  out.headers.set("content-type", beRes.headers.get("content-type") || "application/json");
  return out;
}