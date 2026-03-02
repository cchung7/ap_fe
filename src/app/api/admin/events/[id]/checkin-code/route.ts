import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  return proxyToBackend(req, `/api/admin/events/${ctx.params.id}/checkin-code`);
}