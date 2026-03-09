"use client";

import Link from "next/link";
import { ArrowRight, CalendarPlus, Users } from "lucide-react";

type Action = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const actions: Action[] = [
  {
    title: "Manage Members",
    href: "/admin/members",
    icon: <Users className="h-5 w-5 text-[#4A5568]" />,
  },
  {
    title: "Manage Events",
    href: "/admin/events",
    icon: <CalendarPlus className="h-5 w-5 text-[#4A5568]" />,
  },
];

export function DashboardQuickActions() {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E2E8F0]">
        <h2 className="text-lg font-semibold text-[#2D3748]">Quick Actions</h2>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {actions.map((action) => (
          <Link key={action.title} href={action.href} className="block min-w-0">
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#E2E8F0] hover:bg-gray-50 transition-colors group min-w-0">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#EDF2F7] shrink-0">
                  {action.icon}
                </div>

                <span className="font-medium text-[#4A5568] truncate">
                  {action.title}
                </span>
              </div>

              <ArrowRight className="w-4 h-4 text-[#A0AEC0] group-hover:text-[#4A5568] transition-colors shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}