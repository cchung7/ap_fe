  import { NextRequest } from "next/server";
  import { proxyToBackend } from "@/lib/proxy";

  export async function POST(
    req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
  ) {
    const { id } = await ctx.params;
    return proxyToBackend(req, `/api/admin/events/${id}/checkin-code`);
  }