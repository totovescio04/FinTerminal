"use client";

import { cn } from "@/lib/utils";

interface ChartToolbarProps {
  children?: React.ReactNode;
  className?: string;
}

/** Right-aligned slot above a chart for legends, hints or actions. */
export function ChartToolbar({ children, className }: ChartToolbarProps) {
  return <div className={cn("flex items-center justify-end gap-3", className)}>{children}</div>;
}
