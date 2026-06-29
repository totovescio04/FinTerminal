/**
 * @file constants.ts
 * Static configuration for the Scenario Analysis module.
 */

/** Quick parallel-shift presets, in basis points. */
export const QUICK_SHIFTS_BP: number[] = [
  -200, -150, -100, -75, -50, -25, 0, 25, 50, 75, 100, 150, 200,
];

/** Yield-shift rows used by the sensitivity heatmap (basis points). */
export const HEATMAP_SHIFTS_BP: number[] = [-200, -100, -50, 0, 50, 100, 200];

/** Maturity offsets (years) used by the heatmap columns. */
export const HEATMAP_MATURITY_OFFSETS: number[] = [-4, -2, 0, 2, 4];
