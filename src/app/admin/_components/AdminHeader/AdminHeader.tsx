"use client";

import { Button } from "@/components/ui/button";
import { LayoutDashboard, Plus } from "lucide-react";

interface AdminHeaderProps {
  onAddClick?: () => void;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
}

export default function AdminHeader({
  onAddClick,
  title = "Admin Dashboard",
  subtitle = "Administrative Control Panel",
  actionLabel = "Add",
}: AdminHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
            <LayoutDashboard size={24} />
          </div>
          <h1 className="text-4xl font-heading font-black tracking-tighter uppercase italic">
            {title}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
          {subtitle}
        </p>
      </div>

      {onAddClick && (
        <div className="flex gap-4">
          <Button
            onClick={onAddClick}
            className="h-12 px-8 rounded-2xl bg-accent text-accent-foreground font-black uppercase tracking-widest text-[10px] gap-2 hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-accent/30 dark:shadow-accent/40 cursor-pointer"
          >
            <Plus size={16} />
            {actionLabel}
          </Button>
        </div>
      )}
    </header>
  );
}