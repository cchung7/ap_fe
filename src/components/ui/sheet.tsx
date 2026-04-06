"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const sheetVariants = cva(
  [
    "fixed z-50 flex flex-col",
    "bg-white text-foreground",
    "border border-border/70",
    "shadow-[0_32px_100px_-28px_rgba(11,18,32,0.34)]",
    "transition ease-in-out",
    "data-[state=closed]:duration-200 data-[state=open]:duration-300",
    "overflow-hidden",
  ].join(" "),
  {
    variants: {
      side: {
        top: [
          "inset-x-0 top-0 w-full",
          "max-h-[calc(100vh-1rem)]",
          "rounded-b-[1.5rem] border-b",
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        ].join(" "),
        bottom: [
          "inset-x-0 bottom-0 w-full",
          "max-h-[calc(100vh-1rem)]",
          "rounded-t-[1.5rem] border-t",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        ].join(" "),
        left: [
          "inset-y-0 left-0 h-full w-full",
          "max-w-[min(40rem,100vw)]",
          "border-r",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        ].join(" "),
        right: [
          "inset-y-0 right-0 h-full w-full",
          "max-w-[min(52rem,100vw)]",
          "border-l",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        ].join(" "),
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

function Sheet({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-[rgba(11,18,32,0.52)] backdrop-blur-[2px]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

function SheetContent({
  side = "right",
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof sheetVariants>) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          sheetVariants({ side }),
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          className
        )}
        {...props}
      >
        {children}

        <DialogPrimitive.Close
          className={cn(
            "absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border/60 bg-white text-muted-foreground shadow-[0_8px_20px_-16px_rgba(11,18,32,0.22)] transition-all",
            "hover:border-accent/40 hover:text-accent",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            "disabled:pointer-events-none"
          )}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-2 text-left", className)}
      {...props}
    />
  );
}

function SheetFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function DetailSection({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[1.35rem] border border-border/60",
        "bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,247,252,0.96)_100%)]",
        "p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_12px_24px_-18px_rgba(11,18,32,0.12)]",
        className
      )}
    >
      <div className="mb-3 space-y-1.5">
        <div className="flex items-center gap-2">
          {icon}
          <p className="ui-eyebrow text-muted-foreground">{title}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function DetailLabel({
  children,
  className,
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground/80",
        className
      )}
    >
      {children}
    </p>
  );
}

function DetailStatCard({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.15rem] border border-[rgba(11,45,91,0.10)]",
        "bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(244,247,252,0.98)_100%)]",
        "p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_24px_-18px_rgba(11,18,32,0.10)]",
        className
      )}
    >
      <DetailLabel>{label}</DetailLabel>
      <div className="mt-2 text-2xl font-black text-foreground">{value}</div>
    </div>
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  DetailSection,
  DetailLabel,
  DetailStatCard,
};