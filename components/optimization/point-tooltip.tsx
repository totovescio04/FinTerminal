"use client";

import type { TooltipProps } from "recharts";

interface PointDatum {
  x?: number;
  y?: number;
  label?: string;
}

/** Shared scatter/line tooltip showing risk (x) and return (y). */
export function PointTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  const d = (payload[0]?.payload ?? {}) as PointDatum;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-elevated">
      {d.label && <p className="mb-0.5 font-medium text-foreground">{d.label}</p>}
      <p className="tabular-nums text-muted-foreground">Risk {(d.x ?? 0).toFixed(2)}% · Return {(d.y ?? 0).toFixed(2)}%</p>
    </div>
  );
}
