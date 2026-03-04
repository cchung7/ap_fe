/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/proxy";

export async function OPTIONS(request: NextRequest) {
  return proxyToBackend(request, "/api/auth/login");
}

export async function POST(request: NextRequest) {
  try {
    return proxyToBackend(request, "/api/auth/login");
  } catch (error: any) {
    console.error("FE API Route Error (/api/auth/login):", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}