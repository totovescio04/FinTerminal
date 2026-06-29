/**
 * @file yield.ts
 * Yield-to-maturity solver. Uses Newton-Raphson first and falls back to
 * bisection if Newton fails to converge or leaves the valid domain.
 *
 * Reference: Press et al., "Numerical Recipes" — safeguarded root finding.
 */

import type { Bond, SolverOptions, YieldResult } from "./types";
import { DEFAULT_MAX_ITERATIONS, DEFAULT_TOLERANCE } from "./constants";
import { dirtyPrice } from "./pricing";
import { accruedInterest } from "./accruedInterest";
import { assertValidPrice } from "./validation";

/** Result of a generic root solve. */
export interface SolverResult {
  /** The root found. */
  root: number;
  /** Iterations consumed. */
  iterations: number;
  /** Whether the solver converged within tolerance. */
  converged: boolean;
  /** Method that produced the result. */
  method: "newton-raphson" | "bisection";
}

/**
 * Find a root of `f` using safeguarded Newton-Raphson with a bisection fallback.
 *
 * @param f Continuous function whose root is sought.
 * @param options Tolerance, max iterations, initial guess and bracket bounds.
 * @returns A {@link SolverResult}.
 * @remarks The derivative is estimated by central finite differences, so no
 *          analytic derivative is required from callers.
 */
export function solveRoot(f: (x: number) => number, options: SolverOptions = {}): SolverResult {
  const tol = options.tolerance ?? DEFAULT_TOLERANCE;
  const maxIterations = options.maxIterations ?? DEFAULT_MAX_ITERATIONS;
  const lo0 = options.lowerBound ?? -0.99;
  const hi0 = options.upperBound ?? 5;
  const h = 1e-7;
  let x = options.guess ?? 0.05;
  let iterations = 0;

  // --- Newton-Raphson ---
  for (let i = 0; i < maxIterations; i++) {
    iterations++;
    const fx = f(x);
    if (Math.abs(fx) < tol) {
      return { root: x, iterations, converged: true, method: "newton-raphson" };
    }
    const dfx = (f(x + h) - f(x - h)) / (2 * h);
    if (!Number.isFinite(dfx) || dfx === 0) break;
    const next = x - fx / dfx;
    if (!Number.isFinite(next) || next <= lo0 || next >= hi0) break;
    if (Math.abs(next - x) < tol) {
      x = next;
      return {
        root: x,
        iterations,
        converged: Math.abs(f(x)) < Math.max(tol, 1e-12),
        method: "newton-raphson",
      };
    }
    x = next;
  }

  // --- Bisection fallback ---
  let lo = lo0;
  let hi = hi0;
  let flo = f(lo);
  let fhi = f(hi);
  // Attempt to establish a sign-changing bracket by widening the upper bound.
  let expand = 0;
  while (Math.sign(flo) === Math.sign(fhi) && expand < 60) {
    hi *= 1.5;
    fhi = f(hi);
    expand++;
  }
  if (Math.sign(flo) === Math.sign(fhi)) {
    return { root: x, iterations, converged: false, method: "bisection" };
  }
  for (let i = 0; i < maxIterations; i++) {
    iterations++;
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    if (Math.abs(fm) < tol || (hi - lo) / 2 < tol) {
      return { root: mid, iterations, converged: true, method: "bisection" };
    }
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else {
      hi = mid;
      fhi = fm;
    }
  }
  return { root: (lo + hi) / 2, iterations, converged: false, method: "bisection" };
}

/**
 * Solve a bond's yield to maturity from its clean price.
 *
 * @param bond Normalized bond.
 * @param cleanPriceTarget Quoted clean price per 100 face.
 * @param options Solver options (tolerance defaults to 1e-10, max iterations 1000).
 * @returns A {@link YieldResult}.
 * @formula Finds y such that dirtyPrice(bond, y) = cleanPriceTarget + accrued.
 */
export function yieldFromPrice(
  bond: Bond,
  cleanPriceTarget: number,
  options: SolverOptions = {},
): YieldResult {
  assertValidPrice(cleanPriceTarget);
  const tolerance = options.tolerance ?? DEFAULT_TOLERANCE;
  const targetDirty = cleanPriceTarget + accruedInterest(bond);
  const guess = options.guess ?? (bond.couponRate > 0 ? bond.couponRate : 0.05);
  const result = solveRoot((y) => dirtyPrice(bond, y) - targetDirty, { ...options, guess });
  return {
    yield: result.root,
    iterations: result.iterations,
    converged: result.converged,
    method: result.method,
    tolerance,
  };
}
