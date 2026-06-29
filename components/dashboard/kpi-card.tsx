import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { trendColorClass } from "@/lib/utils/trend";
import type { KpiMetric } from "@/types/metrics";

interface KpiCardProps {
  metric: KpiMetric;
  className?: string;
}

const TREND_ICON = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: Minus,
} as const;

export function KpiCard({ metric, className }: KpiCardProps) {
  const Icon = TREND_ICON[metric.trend ?? "neutral"];

  return (
    <Card className={cn("transition-shadow hover:shadow-elevated", className)}>
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {metric.label}
        </p>
        <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight">{metric.value}</p>
        <div className="mt-2 flex items-center gap-2 text-xs">
          {metric.delta && (
            <span className={cn("inline-flex items-center gap-0.5 font-medium", trendColorClass(metric.trend))}>
              <Icon className="h-3.5 w-3.5" />
              {metric.delta}
            </span>
          )}
          {metric.hint && <span className="text-muted-foreground">{metric.hint}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
