/**
 * @file heatmap.ts
 * Risk heatmap: portfolio market value bucketed by duration (rows) × yield (cols).
 */

import type { RiskPosition } from "./types";

const DURATION_BANDS: { label: string; min: number; max: number }[] = [
  { label: "0–2", min: 0, max: 2 },
  { label: "2–4", min: 2, max: 4 },
  { label: "4–6", min: 4, max: 6 },
  { label: "6–8", min: 6, max: 8 },
  { label: "8–10", min: 8, max: 10 },
  { label: "10+", min: 10, max: Infinity },
];

const YIELD_BANDS: { label: string; min: number; max: number }[] = [
  { label: "0–2%", min: 0, max: 2 },
  { label: "2–4%", min: 2, max: 4 },
  { label: "4–6%", min: 4, max: 6 },
  { label: "6–8%", min: 6, max: 8 },
  { label: "8–12%", min: 8, max: 12 },
  { label: "12%+", min: 12, max: Infinity },
];

export interface RiskHeatmapData {
  durationLabels: string[];
  yieldLabels: string[];
  /** cells[row][col] = total market value in that (duration, yield) bucket. */
  cells: number[][];
}

/** Build the duration × yield market-value heatmap. */
export function riskHeatmap(positions: RiskPosition[]): RiskHeatmapData {
  const cells = DURATION_BANDS.map((d) =>
    YIELD_BANDS.map((y) =>
      positions
        .filter(
          (p) =>
            p.modifiedDuration >= d.min &&
            p.modifiedDuration < d.max &&
            p.yield * 100 >= y.min &&
            p.yield * 100 < y.max,
        )
        .reduce((s, p) => s + p.marketValue, 0),
    ),
  );
  return {
    durationLabels: DURATION_BANDS.map((d) => d.label),
    yieldLabels: YIELD_BANDS.map((y) => y.label),
    cells,
  };
}
