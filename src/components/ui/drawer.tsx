"use client";

export {
  Sheet as Drawer,
  SheetTrigger as DrawerTrigger,
  SheetPortal as DrawerPortal,
  SheetOverlay as DrawerOverlay,
  SheetHeader as DrawerHeader,
  SheetFooter as DrawerFooter,
  SheetTitle as DrawerTitle,
  SheetDescription as DrawerDescription,
} from "@/components/ui/sheet";

import { SheetContent } from "@/components/ui/sheet";
import * as React from "react";

function DrawerContent(
  props: React.ComponentProps<typeof SheetContent>
) {
  return <SheetContent side="bottom" {...props} />;
}

export { DrawerContent };