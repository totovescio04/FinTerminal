/**
 * @file curve.ts
 * Curve construction, tabulation and scenario transforms.
 */

import type {
  CurveOptions,
  CurvePoint,
  CurveTableRow,
  ScenarioParams,
  YieldCurve,
} from "./types";
import { BASIS_POINT } from "./utils";
import { validateCurvePoints } from "./validation";
import { zeroRate } from "./spot";
import { discountFactor } from "./discount";
import { forwardRate } from "./forward";
import { continuousZero } from "./zero";

/** Build a validated zero curve from nodes. */
export function buildCurve(points: CurvePoint[], options: CurveOptions = {}): YieldCurve {
  validateCurvePoints(points);
  return {
    compounding: options.compounding ?? "annual",
    interpolation: options.interpolation ?? "linear",
    points: [...points].sort((a, b) => a.tenor - b.tenor),
  };
}

/** Return a copy of the curve with a different interpolation method. */
export function withInterpolation(curve: YieldCurve, interpolation: YieldCurve["interpolation"]): YieldCurve {
  return { ...curve, interpolation };
}

/** Build a table of spot/forward/discount/zero across tenors. */
export function curveTable(curve: YieldCurve, tenors: number[]): CurveTableRow[] {
  return tenors.map((tenor) => ({
    tenor,
    spotRate: zeroRate(curve, tenor),
    forwardRate: forwardRate(curve, tenor, tenor + 1),
    discountFactor: discountFactor(curve, tenor),
    zeroRate: continuousZero(curve, tenor),
  }));
}

/**
 * Apply a scenario transform, returning a NEW curve (spot/forward/discount all
 * recompute from the shifted nodes).
 *  - parallel  : every node + s.
 *  - steepen   : linear rotation, long end up / short end down around pivot.
 *  - flatten   : inverse of steepen.
 *  - twist     : rotation around the pivot (same shape as steepen).
 *  - butterfly : wings up, belly down (or vice-versa) around the pivot.
 */
export function applyScenario(curve: YieldCurve, params: ScenarioParams): YieldCurve {
  const s = params.bps * BASIS_POINT;
  const tenors = curve.points.map((p) => p.tenor);
  const first = tenors[0]!;
  const last = tenors[tenors.length - 1]!;
  const pivot = params.pivot ?? (first + last) / 2;
  const span = last - first || 1;

  const shifted = curve.points.map((p) => {
    let d = 0;
    switch (params.type) {
      case "parallel":
        d = s;
        break;
      case "steepen":
      case "twist":
        d = s * ((p.tenor - pivot) / span);
        break;
      case "flatten":
        d = -s * ((p.tenor - pivot) / span);
        break;
      case "butterfly":
        d = s * ((2 * Math.abs(p.tenor - pivot)) / span - 0.5);
        break;
    }
    return { tenor: p.tenor, rate: p.rate + d };
  });
  return { ...curve, points: shifted };
}

/** Re-export commonly needed evaluators for convenience. */
export { zeroRate, discountFactor, forwardRate };
