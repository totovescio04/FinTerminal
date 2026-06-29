/**
 * @file solver.ts
 * Constrained quadratic solver via projected gradient descent. The feasible set
 * is the box [l, u] intersected with the budget hyperplane (Σw = total); the
 * projection onto it is a 1-D bisection (water-filling).
 */

import { addVec, clamp, matVec, scaleVec, specNorm, subVec } from "./utils";

/** Project v onto { l ≤ w ≤ u, Σw = total } (water-filling). */
export function projectToSimplexBox(v: number[], l: number[], u: number[], total: number): number[] {
  const n = v.length;
  if (n === 0) return [];
  let lo = Math.min(...v.map((x, i) => x - (u[i] ?? Infinity))) - 1;
  let hi = Math.max(...v.map((x, i) => x - (l[i] ?? -Infinity))) + 1;
  const f = (theta: number) => v.reduce((s, x, i) => s + clamp(x - theta, l[i] ?? -Infinity, u[i] ?? Infinity), 0) - total;
  for (let k = 0; k < 100; k++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > 0) lo = mid;
    else hi = mid;
  }
  const theta = (lo + hi) / 2;
  return v.map((x, i) => clamp(x - theta, l[i] ?? -Infinity, u[i] ?? Infinity));
}

/**
 * Minimize ½wᵀQw + linᵀw over { l ≤ w ≤ u, Σw = total } by projected gradient.
 */
export function solveQP(
  Q: number[][],
  lin: number[],
  l: number[],
  u: number[],
  total: number,
  iters = 4000,
): number[] {
  const n = Q.length;
  let w = projectToSimplexBox(new Array<number>(n).fill(total / n), l, u, total);
  const L = Math.max(specNorm(Q), 1e-8);
  const step = 1 / L;
  for (let i = 0; i < iters; i++) {
    const grad = addVec(matVec(Q, w), lin);
    w = projectToSimplexBox(subVec(w, scaleVec(step, grad)), l, u, total);
  }
  return w;
}

/**
 * Minimum-variance weights (optionally pinned to a target return via a soft
 * penalty). Minimizes wᵀΣw [+ γ(wᵀμ − target)²].
 */
export function minVarianceWeights(
  Sigma: number[][],
  l: number[],
  u: number[],
  total: number,
  options: { mu?: number[]; target?: number; gamma?: number } = {},
): number[] {
  const n = Sigma.length;
  const Q = Sigma.map((row) => row.map((x) => 2 * x));
  let lin = new Array<number>(n).fill(0);
  const { mu, target, gamma = 1e4 } = options;
  if (mu && target !== undefined) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) Q[i]![j]! += 2 * gamma * mu[i]! * mu[j]!;
    }
    lin = mu.map((m) => -2 * gamma * target * m);
  }
  return solveQP(Q, lin, l, u, total);
}
