/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/proxy";

export async function OPTIONS(request: NextRequest) {
  return proxyToBackend(request, "/api/auth/logout");
}

export async function POST(req: NextRequest) {
  try {
    return proxyToBackend(req, "/api/auth/logout");
  } catch (error: any) {
    console.error("FE API Route Error (/api/auth/logout):", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}