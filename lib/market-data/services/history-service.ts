import type { HistoricalField, HistoryRange } from "@/lib/market-data/types";
import { marketDataRepository } from "./core";

/** Historical prices / yields / duration / spread. */
export const historyService = {
  getHistory: (symbol: string, field: HistoricalField = "price", range: HistoryRange = "3M") =>
    marketDataRepository.getHistory(symbol, field, range),
};
