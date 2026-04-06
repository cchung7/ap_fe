"use client";

import { Button } from "@/components/ui/button";
import { LayoutDashboard, Plus, type LucideIcon } from "lucide-react";
import { AdminPageHero } from "../AdminPageHero";

interface AdminHeaderProps {
  onAddClick?: () => void;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  icon?: LucideIcon;
}

export default function AdminHeader({
  onAddClick,
  title = "Admin Dashboard",
  subtitle = "Administrative control center for members, events, and operations.",
  actionLabel = "Add",
  icon: Icon = LayoutDashboard,
}: AdminHeaderProps) {
  return (
    <AdminPageHero
      eyebrow="Admin Workspace"
      title={title}
      subtitle={subtitle}
      badges={[
        {
          key: "scope",
          icon: <Icon size={13} className="text-accent" />,
          label: "Admin User",
        },
      ]}
      action={
        onAddClick ? (
          <Button
            type="button"
            onClick={onAddClick}
            className="h-11 rounded-2xl bg-primary px-5 text-primary-foreground shadow-[0_16px_34px_-18px_rgba(11,45,91,0.35)] hover:bg-primary/92"
          >
            <Plus size={15} />
            {actionLabel}
          </Button>
        ) : null
      }
    />
  );
}