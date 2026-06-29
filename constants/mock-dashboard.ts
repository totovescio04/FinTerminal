import type { KpiMetric } from "@/types/metrics";

/**
 * Placeholder KPI values for the visual dashboard.
 * Stage 1 has no financial logic — these are illustrative only and will be
 * replaced by engine output in Stage 2.
 */
export const DASHBOARD_KPIS: KpiMetric[] = [
  { id: "portfolio-value", label: "Portfolio Value", value: "$12.48M", delta: "+1.8%", trend: "up", hint: "vs. last close" },
  { id: "average-yield", label: "Average Yield", value: "5.24%", delta: "+0.06%", trend: "up", hint: "YTM, weighted" },
  { id: "duration", label: "Duration", value: "6.21y", delta: "-0.12y", trend: "down", hint: "Macaulay" },
  { id: "modified-duration", label: "Modified Duration", value: "5.94", delta: "-0.10", trend: "down", hint: "per 100bp" },
  { id: "convexity", label: "Convexity", value: "48.7", delta: "+0.4", trend: "up", hint: "portfolio" },
  { id: "dv01", label: "DV01", value: "$7,410", delta: "+$120", trend: "up", hint: "per 1bp" },
  { id: "market-value", label: "Market Value", value: "$12.11M", delta: "+1.5%", trend: "up", hint: "dirty" },
  { id: "average-coupon", label: "Average Coupon", value: "4.85%", delta: "0.00%", trend: "neutral", hint: "weighted" },
];
