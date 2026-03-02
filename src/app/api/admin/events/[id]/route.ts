import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  return proxyToBackend(req, `/api/admin/events/${id}`);
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  return proxyToBackend(req, `/api/admin/events/${id}`);
}