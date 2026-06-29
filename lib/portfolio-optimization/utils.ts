/**
 * @file utils.ts
 * Linear-algebra helpers and a seeded RNG. Small, dependency-free.
 */

export const dot = (a: number[], b: number[]): number => a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0);

export const matVec = (M: number[][], v: number[]): number[] => M.map((row) => dot(row, v));

/** Quadratic form wᵀ M w. */
export const quadForm = (w: number[], M: number[][]): number => dot(w, matVec(M, w));

export const addVec = (a: number[], b: number[]): number[] => a.map((x, i) => x + (b[i] ?? 0));
export const subVec = (a: number[], b: number[]): number[] => a.map((x, i) => x - (b[i] ?? 0));
export const scaleVec = (s: number, v: number[]): number[] => v.map((x) => x * s);
export const sum = (v: number[]): number => v.reduce((s, x) => s + x, 0);
export const mean = (v: number[]): number => (v.length === 0 ? 0 : sum(v) / v.length);
export const clamp = (x: number, lo: number, hi: number): number => Math.min(Math.max(x, lo), hi);

export function clipVec(v: number[], l: number[], u: number[]): number[] {
  return v.map((x, i) => clamp(x, l[i] ?? -Infinity, u[i] ?? Infinity));
}

export function identity(n: number): number[][] {
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
}

/** Matrix inverse via Gauss-Jordan with partial pivoting. */
export function inverse(matrix: number[][]): number[][] {
  const n = matrix.length;
  const a = matrix.map((row, i) => [...row, ...identity(n)[i]!]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(a[r]![col]!) > Math.abs(a[pivot]![col]!)) pivot = r;
    if (Math.abs(a[pivot]![col]!) < 1e-12) throw new Error("inverse: singular matrix");
    [a[col], a[pivot]] = [a[pivot]!, a[col]!];
    const pivVal = a[col]![col]!;
    for (let j = 0; j < 2 * n; j++) a[col]![j]! /= pivVal;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = a[r]![col]!;
      for (let j = 0; j < 2 * n; j++) a[r]![j]! -= factor * a[col]![j]!;
    }
  }
  return a.map((row) => row.slice(n));
}

/** Spectral norm (largest eigenvalue) of a symmetric PSD matrix via power iteration. */
export function specNorm(M: number[][], iters = 100): number {
  const n = M.length;
  if (n === 0) return 0;
  let v = new Array<number>(n).fill(1 / Math.sqrt(n));
  let lambda = 0;
  for (let k = 0; k < iters; k++) {
    const Mv = matVec(M, v);
    const norm = Math.sqrt(dot(Mv, Mv));
    if (norm < 1e-15) return 0;
    v = scaleVec(1 / norm, Mv);
    lambda = quadForm(v, M);
  }
  return Math.abs(lambda);
}

/** Mulberry32 seeded PRNG. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
