import type { Trend } from "@/types/metrics";

/** Map a trend to a semantic text colour class. */
export function trendColorClass(trend: Trend | undefined): string {
  switch (trend) {
    case "up":
      return "text-positive";
    case "down":
      return "text-negative";
    default:
      return "text-muted-foreground";
  }
}
