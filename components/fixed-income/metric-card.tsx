"use client";

import { Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
  tooltip?: string;
  loading?: boolean;
  emphasis?: boolean;
  className?: string;
}

/**
 * Single metric tile used across the calculator. Shows a skeleton while
 * `loading`, an optional tooltip, and a subtle highlight when `emphasis`.
 */
export function MetricCard({
  label,
  value,
  hint,
  tooltip,
  loading = false,
  emphasis = false,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border p-4 transition-colors",
        emphasis ? "bg-primary/5" : "bg-card",
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="text-muted-foreground/60 hover:text-foreground" aria-label={`${label} info`}>
                <Info className="h-3 w-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[220px] text-center">{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>
      {loading ? (
        <Skeleton className="mt-2 h-7 w-24" />
      ) : (
        <p className="mt-1.5 text-xl font-semibold tabular-nums tracking-tight">{value}</p>
      )}
      {hint && !loading && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
