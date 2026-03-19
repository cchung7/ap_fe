"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DragScrollXProps = {
  children: React.ReactNode;
  className?: string;
};

export function DragScrollX({ children, className }: DragScrollXProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const dragState = React.useRef({
    startX: 0,
    scrollLeft: 0,
  });

  const stopDragging = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    setIsDragging(true);
    dragState.current = {
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !isDragging) return;

    e.preventDefault();

    const x = e.pageX - el.offsetLeft;
    const walk = x - dragState.current.startX;
    el.scrollLeft = dragState.current.scrollLeft - walk;
  };

  React.useEffect(() => {
    if (!isDragging) return;

    const handleWindowMouseUp = () => {
      stopDragging();
    };

    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [isDragging, stopDragging]);

  return (
    <div
      ref={ref}
      className={cn(
        "max-w-full overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]",
        isDragging ? "cursor-grabbing select-none" : "cursor-grab",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
    >
      {children}
    </div>
  );
}