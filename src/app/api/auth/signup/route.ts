// D:\ap_fe\src\app\api\auth\signup\route.ts
import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/proxy";

export async function OPTIONS(request: NextRequest) {
  return proxyToBackend(request, "/api/auth/signup");
}

export async function POST(request: NextRequest) {
  try {
    return proxyToBackend(request, "/api/auth/signup");
  } catch (error: any) {
    console.error("FE API Route Error (/api/auth/signup):", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}