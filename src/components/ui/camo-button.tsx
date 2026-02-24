"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BaseButtonProps = React.ComponentProps<typeof Button>;

type CamoButtonProps = Omit<BaseButtonProps, "variant"> & {
  href?: string;
};

export function CamoButton({
  className,
  href,
  children,
  ...props
}: CamoButtonProps) {
  const camoClasses = cn(
    "font-black uppercase tracking-widest",
    "text-white/90",
    // INVERTED camo: navy blobs over red base (same as HeroSection)
    "bg-[radial-gradient(circle_at_22%_28%,#0b2d5b_0%,transparent_45%),radial-gradient(circle_at_65%_58%,#143f7a_0%,transparent_48%),radial-gradient(circle_at_42%_82%,#1b4d8f_0%,transparent_55%),linear-gradient(135deg,#8B0000,#B22222)]",
    "border border-black/35",
    "shadow-[0_14px_34px_rgba(0,0,0,0.45)]",
    "[text-shadow:0_1px_2px_rgba(0,0,0,0.6)]",
    "hover:brightness-115 hover:scale-105",
    "active:scale-95",
    "transition-all",
    className
  );

  // Link button
  if (href) {
    return (
      <Button asChild className={camoClasses} {...props}>
        <Link href={href}>{children}</Link>
      </Button>
    );
  }

  // Regular/submit button
  return (
    <Button className={camoClasses} {...props}>
      {children}
    </Button>
  );
}