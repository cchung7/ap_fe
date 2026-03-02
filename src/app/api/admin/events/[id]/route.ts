import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  return proxyToBackend(req, `/api/admin/events/${ctx.params.id}`);
}

export async function DELETE(req: NextRequest, ctx: { params: { id: string } }) {
  return proxyToBackend(req, `/api/admin/events/${ctx.params.id}`);
}