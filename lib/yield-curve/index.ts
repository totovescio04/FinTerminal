/**
 * @file index.ts
 * Public surface of the Yield Curve Engine. Pure TypeScript, framework-free —
 * consumable by Bond Pricing, Portfolio and the Market Data Engine.
 *
 * @example
 * import { bootstrap, discountFactor, forwardRate, presentValue } from "@/lib/yield-curve";
 * const curve = bootstrap([{ tenor: 1, parRate: 0.045 }, { tenor: 2, parRate: 0.042 }]);
 * const df = discountFactor(curve, 1.5);
 * const pv = presentValue([1, 2], [5, 105], curve); // value a bond's cash flows
 */

export type {
  Compounding,
  InterpolationMethod,
  CurveType,
  CurvePoint,
  YieldCurve,
  BootstrapInput,
  CurveOptions,
  CurveTableRow,
  DiscountFactorRow,
  ScenarioType,
  ScenarioParams,
  CurveAnalytics,
} from "./types";

export { BASIS_POINT, discountFromZero, zeroFromDiscount, tenorToYears, round } from "./utils";
export { linearArray, cubicSpline, interpolate } from "./interpolation";
export { bootstrap, bootstrapFromLabels } from "./bootstrap";
export { zeroRate, spotRate } from "./spot";
export { discountFactor, discountFactors, presentValue } from "./discount";
export { forwardRate, namedForward, FORWARD_FORMULA } from "./forward";
export { continuousZero, zero, parRate, parCurve } from "./zero";
export { buildCurve, withInterpolation, curveTable, applyScenario } from "./curve";
export { computeAnalytics } from "./analytics";
export { validateCurvePoints, validateBootstrapInputs, CurveValidationError } from "./validation";
