/**
 * @file types.ts
 * Domain types for the Yield Curve Engine. The curve is represented by its
 * zero/spot rates per tenor; discount factors and forwards are derived.
 */

/** Compounding convention for zero rates / discount factors. */
export type Compounding = "annual" | "continuous";

/** Interpolation method between curve nodes. */
export type InterpolationMethod = "linear" | "logLinear" | "cubic" | "flatForward";

/** Semantic kind of a curve (all share the zero-rate representation). */
export type CurveType = "spot" | "zero" | "par" | "forward" | "discount";

/** A single curve node: a zero/spot rate at a tenor (years). */
export interface CurvePoint {
  /** Tenor in years. */
  tenor: number;
  /** Zero/spot rate (decimal, e.g. 0.045). */
  rate: number;
}

/** A yield curve (zero-rate representation + conventions). */
export interface YieldCurve {
  name?: string;
  compounding: Compounding;
  interpolation: InterpolationMethod;
  /** Nodes sorted ascending by tenor. */
  points: CurvePoint[];
}

/** Input instrument for bootstrapping: a par yield at a tenor. */
export interface BootstrapInput {
  tenor: number;
  /** Par yield (decimal). */
  parRate: number;
}

/** Options controlling curve construction. */
export interface CurveOptions {
  compounding?: Compounding;
  interpolation?: InterpolationMethod;
}

/** A row of the curve table. */
export interface CurveTableRow {
  tenor: number;
  spotRate: number;
  forwardRate: number;
  discountFactor: number;
  zeroRate: number;
}

/** A discount factor at a tenor (for export). */
export interface DiscountFactorRow {
  tenor: number;
  discountFactor: number;
}

/** Curve scenario transform. */
export type ScenarioType = "parallel" | "steepen" | "flatten" | "twist" | "butterfly";

/** Parameters for a scenario transform. */
export interface ScenarioParams {
  type: ScenarioType;
  /** Shift magnitude in basis points. */
  bps: number;
  /** Pivot tenor (years) for rotations / butterfly. */
  pivot?: number;
}

/** Curve analytics summary. */
export interface CurveAnalytics {
  slope2s10s: number;
  steepness2s30s: number;
  curvature: number;
  averageYield: number;
  maxYield: number;
  minYield: number;
  spread2s10s: number;
  spread5s30s: number;
}
