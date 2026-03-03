// D:\ap_fe\src\lib\proxy.ts
import { NextRequest, NextResponse } from "next/server";

export function getBackendBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    "http://localhost:4000"
  );
}

function appendSetCookies(out: NextResponse, beRes: Response) {
  // Next.js Response in Node runtime may expose getSetCookie()
  const anyHeaders = beRes.headers as any;

  const setCookies: string[] | undefined =
    typeof anyHeaders.getSetCookie === "function"
      ? (anyHeaders.getSetCookie() as string[])
      : undefined;

  if (setCookies?.length) {
    for (const c of setCookies) out.headers.append("set-cookie", c);
    return;
  }

  // Fallback: single header
  const single = beRes.headers.get("set-cookie");
  if (single) out.headers.set("set-cookie", single);
}

export async function proxyToBackend(req: NextRequest, backendPath: string) {
  const beBase = getBackendBaseUrl();

  // Forward query params
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

  if (req.method !== "GET" && req.method !== "HEAD") {
    if (hasJsonBody) {
      const body = await req.json().catch(() => undefined);
      init.body = body !== undefined ? JSON.stringify(body) : undefined;
    } else {
      const text = await req.text().catch(() => "");
      init.body = text || undefined;
    }
  }

  const beRes = await fetch(beUrl.toString(), init);
  const raw = await beRes.text();

  const out = new NextResponse(raw, { status: beRes.status });

  // Forward Set-Cookie(s)
  appendSetCookies(out, beRes);

  out.headers.set(
    "content-type",
    beRes.headers.get("content-type") || "application/json"
  );

  return out;
}