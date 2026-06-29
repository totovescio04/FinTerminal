/**
 * @file scenario-engine.ts
 * Pure scenario derivations. Every price comes from the financial engine
 * (`@/lib/fixed-income`); this file only combines engine outputs — it contains
 * no pricing/duration/convexity formulas of its own.
 *
 * Engine functions used:
 *  - `priceFromYield`  exact repricing at a shifted yield (and for the heatmap)
 *  - `createBond`      build maturity variants for the heatmap
 *  - `addMonths`       shift maturities by whole years
 * The base sensitivities (modified duration, convexity, dirty/clean price) are
 * read from the engine's `durationMetrics` / `riskMetrics` / `priceFromYield`
 * results passed in via {@link ScenarioBase}.
 */

import {
  addMonths,
  createBond,
  priceFromYield,
  type Bond,
} from "@/lib/fixed-income";

const BP = 1e-4;

/** Engine-derived base state shared by every scenario computation. */
export interface ScenarioBase {
  bond: Bond;
  /** Base yield to maturity (decimal). */
  ytm: number;
  /** Base clean price per 100 face. */
  clean0: number;
  /** Base dirty price per 100 face. */
  dirty0: number;
  /** Modified duration at the base yield (engine). */
  modified: number;
  /** Convexity at the base yield (engine). */
  convexity: number;
  /** Face value. */
  face: number;
}

/** Full result for a single parallel-shift scenario. */
export interface ScenarioResult {
  shiftBps: number;
  deltaY: number;
  newYield: number;
  newYieldPct: number;
  /** Exact engine prices. */
  exactClean: number;
  exactDirty: number;
  accruedInterest: number;
  /** Exact price change (per 100 face); equal for clean and dirty. */
  exactChange: number;
  exactChangePct: number;
  dollarGain: number;
  /** Estimated price levels (per 100 face, clean). */
  durationPrice: number;
  convexityPrice: number;
  /** Decomposed effects (per 100 face). */
  durationEffect: number;
  convexityEffect: number;
  /** Approximation errors vs. the exact change (per 100 face). */
  errorDuration: number;
  errorConvexity: number;
}

/**
 * Compute one scenario from a parallel yield shift.
 *
 * @formula
 *  - exact: `priceFromYield(bond, ytm + Δy)` (engine).
 *  - duration effect: `-modified · dirty0 · Δy`.
 *  - convexity effect: `½ · convexity · dirty0 · Δy²`.
 *  Estimated clean prices add these effects to the base clean price (accrued is
 *  yield-independent, so the dirty-based slope is the slope of the clean curve).
 */
export function computeScenario(base: ScenarioBase, shiftBps: number): ScenarioResult {
  const deltaY = shiftBps * BP;
  const newYield = base.ytm + deltaY;
  const exact = priceFromYield(base.bond, newYield);
  const exactChange = exact.cleanPrice - base.clean0;

  const durationEffect = -base.modified * base.dirty0 * deltaY;
  const convexityEffect = 0.5 * base.convexity * base.dirty0 * deltaY * deltaY;
  const durationChange = durationEffect;
  const convexityChange = durationEffect + convexityEffect;

  return {
    shiftBps,
    deltaY,
    newYield,
    newYieldPct: newYield * 100,
    exactClean: exact.cleanPrice,
    exactDirty: exact.dirtyPrice,
    accruedInterest: exact.accruedInterest,
    exactChange,
    exactChangePct: base.clean0 === 0 ? 0 : (exactChange / base.clean0) * 100,
    dollarGain: (exactChange / 100) * base.face,
    durationPrice: base.clean0 + durationChange,
    convexityPrice: base.clean0 + convexityChange,
    durationEffect,
    convexityEffect,
    errorDuration: exactChange - durationChange,
    errorConvexity: exactChange - convexityChange,
  };
}

/** Compute a set of scenarios (e.g. the quick presets). */
export function computeScenarioSet(base: ScenarioBase, shiftsBp: number[]): ScenarioResult[] {
  return shiftsBp.map((bp) => computeScenario(base, bp));
}

/** A point on the price/yield sensitivity curve. */
export interface SensitivityPoint {
  yieldPct: number;
  price: number;
}

/** Sample the clean-price curve around the base yield using the engine. */
export function buildSensitivityCurve(
  bond: Bond,
  ytm: number,
  spread = 0.05,
  steps = 48,
): SensitivityPoint[] {
  const lo = ytm - spread;
  const hi = ytm + spread;
  const points: SensitivityPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const y = lo + ((hi - lo) * i) / steps;
    if (y <= -0.99) continue;
    points.push({ yieldPct: y * 100, price: priceFromYield(bond, y).cleanPrice });
  }
  return points;
}

/** A single heatmap cell. */
export interface HeatCell {
  shiftBps: number;
  maturityOffset: number;
  price: number | null;
}

/**
 * Build the sensitivity heatmap: rows are yield shifts, columns are maturity
 * variants. Each cell reprices a maturity-shifted bond at the shifted yield via
 * the engine. Cells whose maturity would fall on/before settlement are null.
 */
export function buildHeatmap(
  bond: Bond,
  ytm: number,
  shiftsBp: number[],
  maturityOffsetsYears: number[],
): HeatCell[][] {
  return shiftsBp.map((shiftBps) =>
    maturityOffsetsYears.map((maturityOffset) => {
      const maturityDate = addMonths(bond.maturityDate, maturityOffset * 12);
      if (maturityDate.getTime() <= bond.settlementDate.getTime()) {
        return { shiftBps, maturityOffset, price: null };
      }
      try {
        const variant = createBond({
          faceValue: bond.faceValue,
          couponRate: bond.couponRate,
          issueDate: bond.issueDate,
          maturityDate,
          settlementDate: bond.settlementDate,
          frequency: bond.frequency,
          dayCount: bond.dayCount,
          redemption: bond.redemption,
        });
        return { shiftBps, maturityOffset, price: priceFromYield(variant, ytm + shiftBps * BP).cleanPrice };
      } catch {
        return { shiftBps, maturityOffset, price: null };
      }
    }),
  );
}
