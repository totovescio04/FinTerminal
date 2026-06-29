"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  benchmarkService,
  fxService,
  historyService,
  marketService,
  quoteService,
  yieldCurveService,
  type MarketDataResult,
} from "@/lib/market-data";
import type {
  Benchmark,
  BondQuote,
  Currency,
  FXRate,
  HistoricalField,
  HistoricalSeries,
  HistoryRange,
  MarketSnapshot,
  ProviderStatus,
  YieldCurve,
} from "@/lib/market-data";

/** Live quote for a symbol (cached via TanStack Query + repository TTL). */
export function useBondQuote(symbol: string): UseQueryResult<MarketDataResult<BondQuote>> {
  return useQuery({ queryKey: ["md", "quote", symbol], queryFn: () => quoteService.getQuote(symbol), enabled: Boolean(symbol) });
}

/** A yield/treasury curve. */
export function useYieldCurve(curveId = "UST"): UseQueryResult<MarketDataResult<YieldCurve>> {
  return useQuery({ queryKey: ["md", "curve", curveId], queryFn: () => yieldCurveService.getCurve(curveId) });
}

/** An FX rate. */
export function useFX(base: Currency, quote: Currency): UseQueryResult<MarketDataResult<FXRate>> {
  return useQuery({ queryKey: ["md", "fx", base, quote], queryFn: () => fxService.getRate(base, quote) });
}

/** A historical series (price/yield/duration/spread). */
export function useHistoricalPrices(
  symbol: string,
  field: HistoricalField = "price",
  range: HistoryRange = "3M",
): UseQueryResult<MarketDataResult<HistoricalSeries>> {
  return useQuery({
    queryKey: ["md", "history", symbol, field, range],
    queryFn: () => historyService.getHistory(symbol, field, range),
    enabled: Boolean(symbol),
  });
}

/** Aggregate market snapshot. */
export function useMarketSnapshot(): UseQueryResult<MarketDataResult<MarketSnapshot>> {
  return useQuery({ queryKey: ["md", "snapshot"], queryFn: () => marketService.getSnapshot() });
}

/** A single benchmark level. */
export function useBenchmark(id: string): UseQueryResult<MarketDataResult<Benchmark>> {
  return useQuery({ queryKey: ["md", "benchmark", id], queryFn: () => benchmarkService.getBenchmark(id) });
}

/** Provider availability/health. */
export function useProviderStatuses(): UseQueryResult<ProviderStatus[]> {
  return useQuery({ queryKey: ["md", "providers"], queryFn: () => marketService.getProviderStatuses(), staleTime: 60_000 });
}
