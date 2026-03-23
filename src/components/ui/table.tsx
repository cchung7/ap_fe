"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DragScrollX } from "@/components/ui/DragScrollX";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return <table data-slot="table" className={cn("w-full", className)} {...props} />;
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn(className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn(className)} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr data-slot="table-row" className={cn(className)} {...props} />;
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return <th data-slot="table-head" className={cn(className)} {...props} />;
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td data-slot="table-cell" className={cn(className)} {...props} />;
}

function AdminDataTableCard({
  tableLabel,
  description,
  children,
  className,
}: {
  tableLabel: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={tableLabel}
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className={cn(
          "overflow-hidden rounded-[2.5rem] border border-border/70 bg-background/70 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.25)]",
          className
        )}
      >
        <div className="border-b border-border/60 bg-secondary/15 px-6 py-5">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground/75">
            {tableLabel}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function AdminTableViewport({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <DragScrollX className={className}>{children}</DragScrollX>;
}

function AdminTableState({
  loading,
  error,
  isEmpty,
  loadingMessage,
  emptyMessage,
  children,
}: {
  loading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  children: React.ReactNode;
}) {
  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        {loadingMessage || "Loading..."}
      </div>
    );
  }

  if (error) {
    return <div className="py-12 text-center text-sm text-destructive">{error}</div>;
  }

  if (isEmpty) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        {emptyMessage || "No records found."}
      </div>
    );
  }

  return <>{children}</>;
}

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  AdminDataTableCard,
  AdminTableViewport,
  AdminTableState,
};