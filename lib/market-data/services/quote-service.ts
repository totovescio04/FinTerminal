import { marketDataRepository } from "./core";

/** Live bond quotes (cached, with provider fallback). */
export const quoteService = {
  getQuote: (symbol: string) => marketDataRepository.getQuote(symbol),
  getQuotes: (symbols: string[] = []) => marketDataRepository.getQuotes(symbols),
};
