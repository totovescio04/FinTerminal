/**
 * @file local-json-provider.ts
 * Fully-implemented offline provider backed by the coherent mock datasets. Acts
 * as the always-available fallback and offline source.
 */

import type {
  Benchmark,
  BondQuote,
  Currency,
  FXRate,
  HistoricalField,
  HistoricalSeries,
  HistoryRange,
  Issuer,
  MarketSnapshot,
  OHLCBar,
  ProviderCapability,
  ProviderId,
  YieldCurve,
} from "@/lib/market-data/types";
import { buildFXRate, coherentSeries, hashSeed, isoDaysAgo, seededRandom } from "@/lib/market-data/utils";
import {
  ARG_CURVE,
  ASOF,
  FX_CHANGE,
  PER_USD,
  QUOTE_SEEDS,
  UST_CURVE,
} from "@/lib/market-data/mock/datasets";
import { BaseMarketDataProvider } from "./base-provider";

const RANGE_DAYS: Record<HistoryRange, number> = {
  "1W": 7,
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "1Y": 252,
  "5Y": 1260,
};

function round(value: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(value * f) / f;
}

export class LocalJsonProvider extends BaseMarketDataProvider {
  readonly id: ProviderId = "local";
  readonly name = "Local JSON";
  readonly capabilities: ProviderCapability[] = [
    "quote",
    "curve",
    "fx",
    "history",
    "snapshot",
    "issuer",
    "benchmark",
  ];

  private buildQuote(symbol: string): BondQuote {
    const seed = QUOTE_SEEDS.find((q) => q.symbol === symbol);
    if (!seed) throw new Error(`local: unknown symbol ${symbol}`);
    const rnd = seededRandom(hashSeed(seed.symbol));
    const halfSpread = seed.price < 80 ? 0.35 : 0.12;
    const bid = round(seed.price - halfSpread, 3);
    const ask = round(seed.price + halfSpread, 3);
    return {
      symbol: seed.symbol,
      isin: seed.isin,
      bid,
      ask,
      mid: round((bid + ask) / 2, 3),
      last: seed.price,
      yield: seed.yield,
      spreadBps: seed.spreadBps,
      changePct: seed.changePct,
      volume: Math.round(500_000 + rnd() * 4_500_000),
      currency: seed.currency,
      timestamp: `${ASOF}T20:00:00Z`,
      source: this.id,
    };
  }

  async getQuote(symbol: string): Promise<BondQuote> {
    return this.buildQuote(symbol);
  }

  async getQuotes(symbols: string[]): Promise<BondQuote[]> {
    const list = symbols.length > 0 ? symbols : QUOTE_SEEDS.map((q) => q.symbol);
    return list.map((s) => this.buildQuote(s));
  }

  async getYieldCurve(curveId: string): Promise<YieldCurve> {
    const isArg = curveId.toUpperCase().startsWith("ARG");
    const points = isArg ? ARG_CURVE : UST_CURVE;
    return {
      id: isArg ? "ARG" : "UST",
      name: isArg ? "Argentina USD Sovereign" : "US Treasury",
      currency: "USD",
      asOf: ASOF,
      points: points.map((p) => ({ tenor: p.tenor, yield: p.yield })),
      source: this.id,
    };
  }

  async getFXRate(base: Currency, quote: Currency): Promise<FXRate> {
    const changePct = round(FX_CHANGE[quote] - FX_CHANGE[base], 3);
    return buildFXRate(base, quote, PER_USD, changePct, ASOF, this.id);
  }

  async getHistory(symbol: string, field: HistoricalField, range: HistoryRange): Promise<HistoricalSeries> {
    const quote = this.buildQuote(symbol);
    const days = RANGE_DAYS[range];
    const start =
      field === "yield" ? quote.yield : field === "spread" ? quote.spreadBps ?? 0 : field === "duration" ? 6 : quote.last;
    const vol = field === "price" ? 0.45 : field === "yield" ? 0.06 : field === "spread" ? 6 : 0.05;
    const path = coherentSeries(hashSeed(`${symbol}:${field}`), days, start, 0, vol);
    const points = path.map((value, i) => ({ date: isoDaysAgo(ASOF, days - 1 - i), value: round(value, 4) }));

    let bars: OHLCBar[] | undefined;
    if (field === "price") {
      bars = path.map((close, i) => {
        const open = i === 0 ? close : path[i - 1]!;
        const high = round(Math.max(open, close) + Math.abs(close) * 0.003, 4);
        const low = round(Math.min(open, close) - Math.abs(close) * 0.003, 4);
        return { date: isoDaysAgo(ASOF, days - 1 - i), open: round(open, 4), high, low, close: round(close, 4), volume: 1_000_000 };
      });
    }
    return { symbol, field, points, bars, source: this.id };
  }

  async getBenchmark(benchmarkId: string): Promise<Benchmark> {
    const tenor = Number(benchmarkId.replace(/[^0-9.]/g, "")) || 10;
    const point = UST_CURVE.reduce((best, p) => (Math.abs(p.tenor - tenor) < Math.abs(best.tenor - tenor) ? p : best), UST_CURVE[0]!);
    return { id: benchmarkId, name: `UST ${tenor}Y`, type: "UST", yield: point.yield, changePct: -0.1, currency: "USD", source: this.id };
  }

  async getSnapshot(): Promise<MarketSnapshot> {
    const benchmarks = await Promise.all(["UST2Y", "UST10Y", "UST30Y"].map((id) => this.getBenchmark(id)));
    const fx = await Promise.all((["EUR", "GBP", "JPY", "ARS"] as Currency[]).map((c) => this.getFXRate("USD", c)));
    const quotes = await this.getQuotes([]);
    const topMovers = [...quotes].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct)).slice(0, 5);
    return { asOf: ASOF, status: "open", benchmarks, fx, topMovers, source: this.id };
  }

  async getIssuer(issuerId: string): Promise<Issuer> {
    const seed = QUOTE_SEEDS.find((q) => q.symbol === issuerId);
    return {
      id: issuerId,
      name: seed?.name ?? issuerId,
      country: seed?.currency === "USD" ? "United States" : "International",
      sector: "Mixed",
      ratings: [{ agency: "S&P", rating: seed && seed.price < 80 ? "CCC" : "A", outlook: "Stable", date: ASOF }],
      source: this.id,
    };
  }
}
