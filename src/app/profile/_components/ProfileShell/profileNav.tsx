"use client";

import type { DrawerMenuItem } from "@/components/ui/DrawerMenu";
import { LayoutDashboard, UserCog, CalendarRange } from "lucide-react";

export const profileToolsItems: DrawerMenuItem[] = [
  { name: "My Dashboard", href: "/profile", icon: LayoutDashboard },
  { name: "Edit My Profile", href: "/profile/edit", icon: UserCog },
  { name: "View My Events", href: "/profile/events", icon: CalendarRange },
];