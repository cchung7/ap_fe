// D:\ap_fe\src\app\admin\_components\AdminHeader\AdminHeader.tsx
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
    <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Icon size={20} />
          </div>

          <h1 className="font-heading text-[1.75rem] sm:text-[1.95rem] font-black uppercase italic tracking-[-0.04em] text-foreground">
            {title}
          </h1>
        </div>

        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
          {subtitle}
        </p>
      </div>

      {onAddClick && (
        <div className="flex gap-3">
          <Button
            type="button"
            variant="logout"
            size="lg"
            onClick={onAddClick}
            className="h-10 rounded-xl px-6 font-black uppercase tracking-[0.16em] text-[9px] sm:text-[10px]"
          >
            <Plus size={14} />
            {actionLabel}
          </Button>
        </div>
      )}
    </header>
  );
}