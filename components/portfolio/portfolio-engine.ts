/**
 * @file portfolio-engine.ts
 * Pure portfolio derivations. Every number comes from the financial engine
 * (`@/lib/fixed-income`); this file only builds engine inputs and aggregates
 * engine outputs — it contains no pricing/duration/convexity formulas.
 *
 * Engine functions used:
 *  - `createBond`          normalize/validate each holding
 *  - `priceFromYield`      clean/dirty/accrued per position
 *  - `durationMetrics`     Macaulay/modified/dollar/effective duration
 *  - `riskMetrics`         DV01 / PVBP / convexity
 *  - `generateCashFlows`   per-position cash flows (aggregated across the book)
 *  - `positionMarketValue` dirty market value of a holding
 *  - `portfolioMetrics`    market-value-weighted yield/duration/convexity + Σ DV01
 */

import {
  createBond,
  durationMetrics,
  generateCashFlows,
  portfolioMetrics,
  positionMarketValue,
  priceFromYield,
  riskMetrics,
  type PortfolioPosition,
} from "@/lib/fixed-income";
import type {
  AggregatedCashFlow,
  AllocationSlice,
  PortfolioAnalytics,
  PortfolioFilterState,
  Position,
  PositionAnalytics,
} from "./types";

/** Build engine inputs and analytics for a single holding. */
export function analyzePosition(position: Position): PositionAnalytics {
  const bond = createBond({
    faceValue: position.faceValue,
    couponRate: position.couponRate / 100,
    issueDate: new Date(position.issueDate),
    maturityDate: new Date(position.maturityDate),
    settlementDate: new Date(position.settlementDate),
    frequency: position.frequency,
    dayCount: position.dayCount,
  });
  const y = position.yield / 100;
  const pricing = priceFromYield(bond, y);
  const durations = durationMetrics(bond, y);
  const risk = riskMetrics(bond, y);
  const cashFlows = generateCashFlows(bond, { yield: y });

  const faceTotal = position.faceValue * position.quantity;
  const marketValue = positionMarketValue({ bond, yield: y, quantity: position.quantity });
  const costBasis = (position.purchasePrice / 100) * faceTotal;
  const pnl = ((pricing.cleanPrice - position.purchasePrice) / 100) * faceTotal;
  const totalPrincipal = cashFlows.reduce((s, cf) => s + cf.principalAmount, 0);
  const principalTime = cashFlows.reduce((s, cf) => s + cf.yearFraction * cf.principalAmount, 0);

  return {
    position,
    bond,
    yieldDecimal: y,
    cleanPrice: pricing.cleanPrice,
    dirtyPrice: pricing.dirtyPrice,
    accruedInterest: pricing.accruedInterest,
    marketValue,
    costBasis,
    pnl,
    returnPct: costBasis === 0 ? 0 : (pnl / costBasis) * 100,
    modifiedDuration: durations.modified,
    macaulayDuration: durations.macaulay,
    convexity: risk.convexity,
    dollarDuration: durations.dollar,
    effectiveDuration: durations.effective,
    dv01: risk.dv01 * (faceTotal / 100),
    pvbp: risk.pvbp * (faceTotal / 100),
    currentYield: pricing.cleanPrice === 0 ? 0 : (position.couponRate / pricing.cleanPrice) * 100,
    wal: totalPrincipal === 0 ? 0 : principalTime / totalPrincipal,
    weight: 0,
  };
}

/** Whether a position passes the active filters. */
export function matchesFilters(a: PositionAnalytics, f: PortfolioFilterState): boolean {
  const search = f.search.trim().toLowerCase();
  if (search) {
    const hay = `${a.position.ticker} ${a.position.bondName}`.toLowerCase();
    if (!hay.includes(search)) return false;
  }
  if (f.currency && a.position.currency !== f.currency) return false;
  const yPct = a.yieldDecimal * 100;
  const within = (value: number, min: string, max: string) => {
    if (min !== "" && Number.isFinite(Number(min)) && value < Number(min)) return false;
    if (max !== "" && Number.isFinite(Number(max)) && value > Number(max)) return false;
    return true;
  };
  if (!within(yPct, f.yieldMin, f.yieldMax)) return false;
  if (!within(a.modifiedDuration, f.durationMin, f.durationMax)) return false;
  if (!within(a.position.couponRate, f.couponMin, f.couponMax)) return false;
  const matYear = new Date(a.position.maturityDate).getUTCFullYear();
  if (f.maturityFromYear !== "" && matYear < Number(f.maturityFromYear)) return false;
  if (f.maturityToYear !== "" && matYear > Number(f.maturityToYear)) return false;
  return true;
}

function allocate(groups: Map<string, number>, total: number): AllocationSlice[] {
  return [...groups.entries()]
    .map(([label, value]) => ({ label, value, weight: total === 0 ? 0 : value / total }))
    .sort((a, b) => b.value - a.value);
}

function aggregateCashFlows(list: PositionAnalytics[]): AggregatedCashFlow[] {
  const byDate = new Map<string, AggregatedCashFlow>();
  for (const a of list) {
    const qty = a.position.quantity;
    for (const cf of generateCashFlows(a.bond, { yield: a.yieldDecimal })) {
      const key = cf.paymentDate.toISOString().slice(0, 10);
      const row = byDate.get(key) ?? { date: key, coupon: 0, principal: 0, total: 0, presentValue: 0 };
      row.coupon += cf.couponAmount * qty;
      row.principal += cf.principalAmount * qty;
      row.total += cf.totalCashFlow * qty;
      row.presentValue += cf.presentValue * qty;
      byDate.set(key, row);
    }
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

const EMPTY: PortfolioAnalytics = {
  positions: [],
  marketValue: 0,
  totalFaceValue: 0,
  numberOfBonds: 0,
  averageYield: 0,
  averageCoupon: 0,
  modifiedDuration: 0,
  macaulayDuration: 0,
  convexity: 0,
  dv01: 0,
  pvbp: 0,
  weightedAverageLife: 0,
  allocationByAsset: [],
  allocationByCurrency: [],
  allocationByMaturity: [],
  aggregatedCashFlows: [],
};

/**
 * Analyze every position, apply filters, then aggregate the surviving holdings.
 * Aggregate yield/coupon/duration/convexity/DV01 come from the engine's
 * `portfolioMetrics`; PVBP and weighted-average life aggregate per-position
 * engine outputs by market value.
 */
export function buildPortfolio(
  positions: Position[],
  filters: PortfolioFilterState,
): PortfolioAnalytics {
  const all = positions.map(analyzePosition);
  const list = all.filter((a) => matchesFilters(a, filters));
  if (list.length === 0) return EMPTY;

  const totalMV = list.reduce((s, a) => s + a.marketValue, 0);
  for (const a of list) a.weight = totalMV === 0 ? 0 : a.marketValue / totalMV;

  const enginePositions: PortfolioPosition[] = list.map((a) => ({
    bond: a.bond,
    yield: a.yieldDecimal,
    quantity: a.position.quantity,
  }));
  const pm = portfolioMetrics(enginePositions);

  const byCurrency = new Map<string, number>();
  const byMaturity = new Map<string, number>();
  for (const a of list) {
    byCurrency.set(a.position.currency, (byCurrency.get(a.position.currency) ?? 0) + a.marketValue);
    const year = String(new Date(a.position.maturityDate).getUTCFullYear());
    byMaturity.set(year, (byMaturity.get(year) ?? 0) + a.marketValue);
  }

  const pvbp = list.reduce((s, a) => s + a.pvbp, 0);
  const wal = totalMV === 0 ? 0 : list.reduce((s, a) => s + a.marketValue * a.wal, 0) / totalMV;

  return {
    positions: list,
    marketValue: pm.marketValue,
    totalFaceValue: pm.totalFaceValue,
    numberOfBonds: list.length,
    averageYield: pm.averageYield * 100,
    averageCoupon: pm.averageCoupon * 100,
    modifiedDuration: pm.modifiedDuration,
    macaulayDuration: pm.macaulayDuration,
    convexity: pm.convexity,
    dv01: pm.dv01,
    pvbp,
    weightedAverageLife: wal,
    allocationByAsset: list
      .map((a) => ({ label: a.position.ticker, value: a.marketValue, weight: a.weight }))
      .sort((x, y) => y.value - x.value),
    allocationByCurrency: allocate(byCurrency, totalMV),
    allocationByMaturity: allocate(byMaturity, totalMV).sort((x, y) => Number(x.label) - Number(y.label)),
    aggregatedCashFlows: aggregateCashFlows(list),
  };
}

/** Portfolio risk highlights for the risk panel. */
export interface PortfolioRiskHighlights {
  largestPosition: PositionAnalytics | null;
  highestDuration: PositionAnalytics | null;
  highestConvexity: PositionAnalytics | null;
  highestDv01: PositionAnalytics | null;
  averageYield: number;
  riskScore: number;
}

/**
 * Derive risk highlights. The risk score is a presentation-only heuristic that
 * scales the engine's weighted modified duration and convexity to 0–100.
 */
export function buildRiskHighlights(p: PortfolioAnalytics): PortfolioRiskHighlights {
  if (p.positions.length === 0) {
    return {
      largestPosition: null,
      highestDuration: null,
      highestConvexity: null,
      highestDv01: null,
      averageYield: 0,
      riskScore: 0,
    };
  }
  const by = (selector: (a: PositionAnalytics) => number) =>
    p.positions.reduce((best, a) => (selector(a) > selector(best) ? a : best), p.positions[0]!);
  const riskScore = Math.min(100, p.modifiedDuration * 8 + p.convexity * 0.15);
  return {
    largestPosition: by((a) => a.marketValue),
    highestDuration: by((a) => a.modifiedDuration),
    highestConvexity: by((a) => a.convexity),
    highestDv01: by((a) => a.dv01),
    averageYield: p.averageYield,
    riskScore,
  };
}
