/**
 * @file interpolation.ts
 * Interpolation primitives used by the curve. Methods:
 *  - linear      : straight line between nodes (flat extrapolation at ends).
 *  - logLinear   : linear in ln(y) → exp(linear(ln y)).
 *  - cubic       : natural cubic spline (C² smooth, passes through nodes).
 *  - flatForward : handled in spot.ts (linear in z·t → piecewise-flat forwards).
 */

import { lerp } from "./utils";

/** Linear interpolation over arrays with flat extrapolation beyond the ends. */
export function linearArray(x: number, xs: number[], ys: number[]): number {
  const n = xs.length;
  if (n === 0) throw new Error("linearArray: empty arrays");
  if (x <= xs[0]!) return ys[0]!;
  if (x >= xs[n - 1]!) return ys[n - 1]!;
  for (let i = 0; i < n - 1; i++) {
    if (x >= xs[i]! && x <= xs[i + 1]!) {
      return lerp(x, xs[i]!, ys[i]!, xs[i + 1]!, ys[i + 1]!);
    }
  }
  return ys[n - 1]!;
}

/**
 * Build a natural cubic-spline evaluator through (xs, ys).
 * Solves the tridiagonal system for the second derivatives (m_i), then
 * evaluates the piecewise cubic. Flat extrapolation beyond the ends.
 */
export function cubicSpline(xs: number[], ys: number[]): (x: number) => number {
  const n = xs.length;
  if (n < 3) {
    return (x: number) => linearArray(x, xs, ys);
  }
  const h: number[] = [];
  for (let i = 0; i < n - 1; i++) h.push(xs[i + 1]! - xs[i]!);

  // Tridiagonal system A·m = d for interior second derivatives (natural: m0=mN-1=0).
  const a = new Array<number>(n).fill(0);
  const b = new Array<number>(n).fill(1);
  const c = new Array<number>(n).fill(0);
  const d = new Array<number>(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    a[i] = h[i - 1]!;
    b[i] = 2 * (h[i - 1]! + h[i]!);
    c[i] = h[i]!;
    d[i] = 6 * ((ys[i + 1]! - ys[i]!) / h[i]! - (ys[i]! - ys[i - 1]!) / h[i - 1]!);
  }
  // Thomas algorithm.
  const cp = new Array<number>(n).fill(0);
  const dp = new Array<number>(n).fill(0);
  cp[0] = c[0]! / b[0]!;
  dp[0] = d[0]! / b[0]!;
  for (let i = 1; i < n; i++) {
    const denom = b[i]! - a[i]! * cp[i - 1]!;
    cp[i] = c[i]! / denom;
    dp[i] = (d[i]! - a[i]! * dp[i - 1]!) / denom;
  }
  const m = new Array<number>(n).fill(0);
  m[n - 1] = dp[n - 1]!;
  for (let i = n - 2; i >= 0; i--) m[i] = dp[i]! - cp[i]! * m[i + 1]!;

  return (x: number): number => {
    if (x <= xs[0]!) return ys[0]!;
    if (x >= xs[n - 1]!) return ys[n - 1]!;
    let i = 0;
    while (i < n - 1 && x > xs[i + 1]!) i++;
    const hi = h[i]!;
    const dx0 = x - xs[i]!;
    const dx1 = xs[i + 1]! - x;
    return (
      (m[i]! * dx1 ** 3 + m[i + 1]! * dx0 ** 3) / (6 * hi) +
      (ys[i]! / hi - (m[i]! * hi) / 6) * dx1 +
      (ys[i + 1]! / hi - (m[i + 1]! * hi) / 6) * dx0
    );
  };
}

/** Generic interpolation for linear / cubic / logLinear methods. */
export function interpolate(
  x: number,
  xs: number[],
  ys: number[],
  method: "linear" | "cubic" | "logLinear",
): number {
  if (method === "linear") return linearArray(x, xs, ys);
  if (method === "cubic") return cubicSpline(xs, ys)(x);
  // logLinear: exp(linear(ln y)) — requires positive y.
  const lnY = ys.map((y) => Math.log(y));
  return Math.exp(linearArray(x, xs, lnY));
}
