// D:\ap_fe\src\app\api\admin\users\[id]\route.ts
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await ctx.params;
  return proxyToBackend(req, `/api/admin/users/${params.id}`);
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> | { id: string } }
) {
  const params = await ctx.params;
  return proxyToBackend(req, `/api/admin/users/${params.id}`);
}