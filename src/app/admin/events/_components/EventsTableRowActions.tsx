"use client";

import * as React from "react";
import { Eye, Pencil } from "lucide-react";

import { DeleteButton, RowActionButton } from "@/components/admin/AdminEntityUI";

type EventsTableRowActionsProps = {
  isDeleting: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function EventsTableRowActions({
  isDeleting,
  onView,
  onEdit,
  onDelete,
}: EventsTableRowActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <RowActionButton
        variant="default"
        onClick={onView}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        icon={<Eye className="h-3 w-3" />}
      >
        View Event
      </RowActionButton>

      <RowActionButton
        onClick={onEdit}
        className="border border-green-300 bg-green-600 text-white hover:border-green-700 hover:bg-green-700"
        icon={<Pencil className="h-3 w-3" />}
      >
        Edit Event
      </RowActionButton>

      <DeleteButton loading={isDeleting} onClick={onDelete}>
        Delete
      </DeleteButton>
    </div>
  );
}