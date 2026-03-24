"use client";

import type { DrawerMenuItem } from "@/components/ui/DrawerMenu";
import { UserCog, CalendarRange } from "lucide-react";

export const profileToolsItems: DrawerMenuItem[] = [
  { name: "EDIT PROFILE", href: "/profile/edit", icon: UserCog },
  { name: "VIEW MY EVENTS", href: "/profile/events", icon: CalendarRange },
];