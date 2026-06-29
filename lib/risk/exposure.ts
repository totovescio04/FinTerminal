/**
 * @file exposure.ts
 * Exposure aggregation by any key, plus maturity buckets. Pure functions over
 * {@link RiskPosition} (engine-derived market values).
 */

import type { ExposureSlice, MaturityBucket, RiskPosition } from "./types";

/** Group positions by a key and compute value / weight / count per group. */
export function exposureBy(positions: RiskPosition[], keyFn: (p: RiskPosition) => string): ExposureSlice[] {
  const total = positions.reduce((s, p) => s + p.marketValue, 0);
  const map = new Map<string, { value: number; count: number }>();
  for (const p of positions) {
    const key = keyFn(p) || "—";
    const cur = map.get(key) ?? { value: 0, count: 0 };
    cur.value += p.marketValue;
    cur.count += 1;
    map.set(key, cur);
  }
  return [...map.entries()]
    .map(([key, { value, count }]) => ({ key, value, weight: total === 0 ? 0 : value / total, count }))
    .sort((a, b) => b.value - a.value);
}

export const exposureByIssuer = (p: RiskPosition[]) => exposureBy(p, (x) => x.issuer);
export const exposureByCountry = (p: RiskPosition[]) => exposureBy(p, (x) => x.country);
export const exposureByCurrency = (p: RiskPosition[]) => exposureBy(p, (x) => x.currency);
export const exposureBySector = (p: RiskPosition[]) => exposureBy(p, (x) => x.sector);
export const exposureByRating = (p: RiskPosition[]) => exposureBy(p, (x) => x.rating);
export const exposureByCouponType = (p: RiskPosition[]) => exposureBy(p, (x) => x.couponType);

/** Maturity bucket boundaries (years) and labels. */
export const MATURITY_BUCKETS: { label: string; min: number; max: number }[] = [
  { label: "0–1y", min: 0, max: 1 },
  { label: "1–3y", min: 1, max: 3 },
  { label: "3–5y", min: 3, max: 5 },
  { label: "5–7y", min: 5, max: 7 },
  { label: "7–10y", min: 7, max: 10 },
  { label: "10–20y", min: 10, max: 20 },
  { label: "20y+", min: 20, max: Infinity },
];

/** Bucket positions by remaining maturity with value/weight/duration. */
export function maturityBuckets(positions: RiskPosition[]): MaturityBucket[] {
  const total = positions.reduce((s, p) => s + p.marketValue, 0);
  return MATURITY_BUCKETS.map((b) => {
    const inBucket = positions.filter((p) => p.remainingYears >= b.min && p.remainingYears < b.max);
    const value = inBucket.reduce((s, p) => s + p.marketValue, 0);
    const mvDur = inBucket.reduce((s, p) => s + p.marketValue * p.modifiedDuration, 0);
    return {
      label: b.label,
      count: inBucket.length,
      value,
      weight: total === 0 ? 0 : value / total,
      duration: value === 0 ? 0 : mvDur / value,
    };
  });
}
