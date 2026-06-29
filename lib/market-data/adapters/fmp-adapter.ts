import type { BondQuote, ProviderId } from "@/lib/market-data/types";
import type { DataAdapter } from "./types";

/** FMP quote shape (subset). */
export interface FmpQuote {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  changesPercentage: number;
  volume: number;
}

/** Map an FMP quote into a domain {@link BondQuote}. */
export const fmpQuoteAdapter: DataAdapter<FmpQuote, BondQuote> = {
  adapt(raw) {
    const source: ProviderId = "fmp";
    return {
      symbol: raw.symbol,
      bid: raw.bid,
      ask: raw.ask,
      mid: (raw.bid + raw.ask) / 2,
      last: raw.price,
      yield: 0,
      changePct: raw.changesPercentage,
      volume: raw.volume,
      currency: "USD",
      timestamp: new Date().toISOString(),
      source,
    };
  },
};
