import { NextResponse } from "next/server";

import { mockAdminMembers } from "@/data/mockAdminMembers";
import { mockAdminEvents } from "@/data/mockAdminEvents";
import { mockAdminRecentActivity } from "@/data/mockAdminRecentActivity";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      members: mockAdminMembers,
      events: mockAdminEvents,
      activities: mockAdminRecentActivity,
    },
  });
}