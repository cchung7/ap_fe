"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdminPageHero } from "../../_components/AdminPageHero";

type EventsPageHeroProps = {
  onCreate: () => void;
};

export function EventsPageHero({ onCreate }: EventsPageHeroProps) {
  return (
    <AdminPageHero
      eyebrow="Admin Workspace"
      title="Event Management"
      subtitle="Manage scheduled events, registration capacity, and check-in details."
      action={
        <Button
          type="button"
          onClick={onCreate}
          className="h-11 rounded-2xl bg-primary px-5 text-primary-foreground shadow-[0_16px_34px_-18px_rgba(11,45,91,0.35)] hover:bg-primary/92"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      }
    />
  );
}