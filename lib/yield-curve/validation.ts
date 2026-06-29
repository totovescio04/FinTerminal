/**
 * @file validation.ts
 * Validation for curve inputs and nodes.
 */

import type { BootstrapInput, CurvePoint } from "./types";

export class CurveValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CurveValidationError";
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new CurveValidationError(message);
}

/** Validate tenor/rate pairs: present, finite, non-negative tenors, strictly increasing, no duplicates. */
export function validateCurvePoints(points: CurvePoint[]): void {
  assert(Array.isArray(points) && points.length >= 2, "A curve needs at least 2 points");
  for (const p of points) {
    assert(Number.isFinite(p.tenor) && Number.isFinite(p.rate), "Missing or non-numeric curve data");
    assert(p.tenor > 0, "Tenors must be positive");
  }
  const sorted = [...points].sort((a, b) => a.tenor - b.tenor);
  for (let i = 1; i < sorted.length; i++) {
    assert(sorted[i]!.tenor !== sorted[i - 1]!.tenor, `Duplicate tenor: ${sorted[i]!.tenor}`);
    assert(sorted[i]!.tenor > sorted[i - 1]!.tenor, "Tenors must be strictly increasing");
  }
}

/** Validate bootstrap par-rate inputs. */
export function validateBootstrapInputs(inputs: BootstrapInput[]): void {
  assert(Array.isArray(inputs) && inputs.length >= 1, "Provide at least one instrument");
  for (const i of inputs) {
    assert(Number.isFinite(i.tenor) && Number.isFinite(i.parRate), "Missing or non-numeric input");
    assert(i.tenor > 0, "Tenors must be positive");
    assert(i.parRate > -1, "Par rate must be greater than -100%");
  }
  validateCurvePoints(inputs.map((i) => ({ tenor: i.tenor, rate: i.parRate })));
}
