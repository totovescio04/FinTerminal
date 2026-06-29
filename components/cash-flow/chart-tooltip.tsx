"use client";

import type { TooltipProps } from "recharts";
import { formatNumber } from "@/lib/utils/format";

interface ChartTooltipProps extends TooltipProps<number, string> {
  /** Formats numeric values; defaults to 4-decimal fixed. */
  valueFormatter?: (value: number) => string;
  /** Optional prefix before the label (e.g. "Yield "). */
  labelPrefix?: string;
  /** Optional suffix after the label (e.g. "%"). */
  labelSuffix?: string;
  /** Extra rows read from the hovered datum (payload[0].payload). */
  extraRows?: { key: string; label: string; suffix?: string; decimals?: number }[];
}

/** Themed, strongly-typed tooltip shared by all charts (no `any`). */
export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
  labelPrefix = "",
  labelSuffix = "",
  extraRows = [],
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const format = valueFormatter ?? ((v: number) => formatNumber(v, 4));
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-elevated">
      {label !== undefined && (
        <p className="mb-1 font-medium text-foreground">
          {labelPrefix}
          {String(label)}
          {labelSuffix}
        </p>
      )}
      <div className="space-y-0.5">
        {payload.map((item, i) => (
          <div key={`${item.name}-${i}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <span className="font-medium tabular-nums text-foreground">
              {typeof item.value === "number" ? format(item.value) : String(item.value ?? "—")}
            </span>
          </div>
        ))}
        {extraRows.map((row) => {
          const datum = (payload[0]?.payload ?? {}) as Record<string, unknown>;
          const raw = datum[row.key];
          const text =
            typeof raw === "number" ? formatNumber(raw, row.decimals ?? 4) + (row.suffix ?? "") : String(raw ?? "—");
          return (
            <div key={row.key} className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium tabular-nums text-foreground">{text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
