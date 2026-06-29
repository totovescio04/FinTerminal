/**
 * @file metrics.ts
 * Single source of truth for compared metrics. Every value is read from the
 * financial engine's analytics (`@/components/fixed-income`) — no recomputation.
 * Used by the comparison table, export and rankings.
 *
 * To add a metric: append a descriptor here; the table, export and rankings pick
 * it up automatically.
 */

import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { ratingRank } from "@/lib/data/bond-model";
import type { ComparisonResult } from "./types";

const pct = (v: number) => `${formatNumber(v, 3)}%`;
const num = (v: number, d = 4) => formatNumber(v, d);

export interface Metric {
  key: string;
  label: string;
  /** Formatted cell value. */
  display: (r: ComparisonResult) => string;
  /** If set, the best value across bonds is highlighted. */
  highlight?: "high" | "low";
  /** Numeric value for highlight / ranking (required if highlightable). */
  rank?: (r: ComparisonResult) => number;
}

export const METRICS: Metric[] = [
  { key: "cleanPrice", label: "Clean Price", display: (r) => num(r.analytics.pricing.cleanPrice) },
  { key: "dirtyPrice", label: "Dirty Price", display: (r) => num(r.analytics.pricing.dirtyPrice) },
  { key: "yield", label: "Yield (YTM)", display: (r) => pct(r.analytics.yieldDecimal * 100), highlight: "high", rank: (r) => r.analytics.yieldDecimal },
  { key: "currentYield", label: "Current Yield", display: (r) => pct(r.analytics.currentYield), highlight: "high", rank: (r) => r.analytics.currentYield },
  { key: "coupon", label: "Coupon", display: (r) => pct(r.bond.form.couponRate) },
  { key: "frequency", label: "Frequency", display: (r) => r.bond.form.frequency },
  { key: "issueDate", label: "Issue Date", display: (r) => r.bond.form.issueDate },
  { key: "settlementDate", label: "Settlement", display: (r) => r.bond.form.settlementDate },
  { key: "maturityDate", label: "Maturity", display: (r) => r.bond.form.maturityDate },
  { key: "remainingYears", label: "Remaining Years", display: (r) => `${num(r.remainingYears, 2)}y` },
  { key: "accrued", label: "Accrued Interest", display: (r) => num(r.analytics.pricing.accruedInterest) },
  { key: "macaulay", label: "Macaulay Duration", display: (r) => `${num(r.analytics.durations.macaulay, 3)}y` },
  { key: "modified", label: "Modified Duration", display: (r) => `${num(r.analytics.durations.modified, 3)}y`, highlight: "low", rank: (r) => r.analytics.durations.modified },
  { key: "dollarDuration", label: "Dollar Duration", display: (r) => num(r.analytics.durations.dollar) },
  { key: "effectiveDuration", label: "Effective Duration", display: (r) => `${num(r.analytics.durations.effective, 3)}y` },
  { key: "convexity", label: "Convexity", display: (r) => num(r.analytics.risk.convexity, 2), highlight: "high", rank: (r) => r.analytics.risk.convexity },
  { key: "dv01", label: "DV01", display: (r) => num(r.analytics.risk.dv01, 5), highlight: "low", rank: (r) => r.analytics.risk.dv01 },
  { key: "pvbp", label: "PVBP", display: (r) => num(r.analytics.risk.pvbp, 5) },
  { key: "wal", label: "Weighted Avg Life", display: (r) => `${num(r.wal, 2)}y` },
  { key: "presentValue", label: "Present Value", display: (r) => formatCurrency(r.analytics.pricing.presentValue) },
  { key: "marketValue", label: "Market Value", display: (r) => formatCurrency(r.analytics.marketValue) },
  { key: "ustSpread", label: "Spread vs UST", display: (r) => `${num(r.ustSpreadBps, 1)} bp` },
  { key: "currency", label: "Currency", display: (r) => r.bond.currency },
  { key: "rating", label: "Rating", display: (r) => r.bond.rating ?? "—", highlight: "high", rank: (r) => (r.bond.rating ? -ratingRank(r.bond.rating) : -99) },
  { key: "country", label: "Country", display: (r) => r.bond.country ?? "—" },
  { key: "issuer", label: "Issuer", display: (r) => r.bond.issuer ?? "—" },
  { key: "sector", label: "Sector", display: (r) => r.bond.sector ?? "—" },
];

/** Index of the best bond for a highlightable metric, or -1. */
export function bestIndex(results: ComparisonResult[], metric: Metric): number {
  if (!metric.highlight || !metric.rank || results.length === 0) return -1;
  const rankFn = metric.rank;
  let best = 0;
  for (let i = 1; i < results.length; i++) {
    const a = rankFn(results[i]!);
    const b = rankFn(results[best]!);
    if (metric.highlight === "high" ? a > b : a < b) best = i;
  }
  return best;
}

/** Ranking definitions for the ranking table. */
export interface RankingDef {
  key: string;
  label: string;
  value: (r: ComparisonResult) => number;
  format: (r: ComparisonResult) => string;
  direction: "desc" | "asc";
}

export const RANKINGS: RankingDef[] = [
  { key: "yield", label: "Highest Yield", value: (r) => r.analytics.yieldDecimal, format: (r) => pct(r.analytics.yieldDecimal * 100), direction: "desc" },
  { key: "convexity", label: "Highest Convexity", value: (r) => r.analytics.risk.convexity, format: (r) => num(r.analytics.risk.convexity, 2), direction: "desc" },
  { key: "duration", label: "Highest Duration", value: (r) => r.analytics.durations.modified, format: (r) => `${num(r.analytics.durations.modified, 2)}y`, direction: "desc" },
  { key: "price", label: "Highest Price", value: (r) => r.analytics.pricing.cleanPrice, format: (r) => num(r.analytics.pricing.cleanPrice, 2), direction: "desc" },
  { key: "risk", label: "Highest Risk (DV01)", value: (r) => r.analytics.risk.dv01, format: (r) => num(r.analytics.risk.dv01, 5), direction: "desc" },
];
