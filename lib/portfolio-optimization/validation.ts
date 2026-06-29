/**
 * @file validation.ts
 * Validate optimization inputs.
 */

import type { OptimizationInput } from "./types";

export class OptimizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OptimizationError";
  }
}

function assert(cond: boolean, msg: string): asserts cond {
  if (!cond) throw new OptimizationError(msg);
}

/** Validate dimensions, symmetry and constraint feasibility. */
export function validateInput(input: OptimizationInput): void {
  const n = input.expectedReturns.length;
  assert(n >= 2, "Need at least 2 assets");
  assert(input.covariance.length === n, "Covariance dimension must match assets");
  for (const row of input.covariance) {
    assert(row.length === n, "Covariance must be square");
    for (const v of row) assert(Number.isFinite(v), "Covariance has non-finite values");
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      assert(Math.abs(input.covariance[i]![j]! - input.covariance[j]![i]!) < 1e-6, "Covariance must be symmetric");
    }
  }
  const c = input.constraints;
  assert(c.maxWeight > 0, "maxWeight must be positive");
  assert(c.cash >= 0 && c.cash < 1, "cash must be in [0, 1)");
  const total = 1 - c.cash;
  const lower = c.allowShort ? -Math.abs(c.maxWeight) : Math.max(c.minWeight, 0);
  assert(lower * n <= total + 1e-9 && c.maxWeight * n >= total - 1e-9, "Constraints are infeasible for the budget");
}
