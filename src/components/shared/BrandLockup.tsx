"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLockupProps = {
  href?: string;
  title: React.ReactNode;
  alt?: string;
  className?: string;
  titleClassName?: string;
};

export function BrandLockup({
  href,
  title,
  alt = "SVA Logo",
  className,
  titleClassName,
}: BrandLockupProps) {
  const content = (
    <div className={cn("flex items-center gap-2 min-w-0", className)}>
      <div className="relative h-10 w-10 shrink-0">
        <Image
          src="/logo/logo.png"
          alt={alt}
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className={cn("min-w-0", titleClassName)}>{title}</div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group min-w-0">
        {content}
      </Link>
    );
  }

  return content;
}