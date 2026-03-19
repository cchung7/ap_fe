"use client";

import { Button } from "@/components/ui/button";
import { LayoutDashboard, Plus, type LucideIcon } from "lucide-react";

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
  subtitle = "Administrative Control Panel",
  actionLabel = "Add",
  icon: Icon = LayoutDashboard,
}: AdminHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Icon size={24} />
          </div>
          <h1 className="font-heading text-4xl font-black uppercase italic tracking-tighter">
            {title}
          </h1>
        </div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {subtitle}
        </p>
      </div>

      {onAddClick && (
        <div className="flex gap-4">
          <Button
            type="button"
            variant="logout"
            size="lg"
            onClick={onAddClick}
            className="h-12 rounded-2xl px-8 font-black uppercase tracking-widest text-[10px]"
          >
            <Plus size={16} />
            {actionLabel}
          </Button>
        </div>
      )}
    </header>
  );
}