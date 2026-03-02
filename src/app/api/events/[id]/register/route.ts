import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy";

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  return proxyToBackend(req, `/api/events/${ctx.params.id}/register`);
}