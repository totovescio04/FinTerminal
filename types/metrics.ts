/** Direction of a change, used to colour deltas (green/red/neutral). */
export type Trend = "up" | "down" | "neutral";

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  /** Optional contextual delta, e.g. "+1.2%". */
  delta?: string;
  trend?: Trend;
  /** Short helper text under the value. */
  hint?: string;
}
