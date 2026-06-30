/**
 * @file manual-provider.ts
 * Manual provider: lets a user inject quotes by hand (e.g. paste a runs sheet).
 * Available only when quotes have been supplied.
 */

import type { BondQuote, ProviderCapability, ProviderId } from "@/lib/market-data/types";
import { BaseMarketDataProvider } from "./base-provider";

export class ManualProvider extends BaseMarketDataProvider {
  readonly id: ProviderId = "manual";
  readonly name = "Manual";
  readonly capabilities: ProviderCapability[] = ["quote"];
  private quotes = new Map<string, BondQuote>();

  /** Inject or update a manual quote. */
  setQuote(quote: BondQuote): void {
    this.quotes.set(quote.symbol, { ...quote, source: this.id });
  }

  override async isAvailable(): Promise<boolean> {
    return this.quotes.size > 0;
  }

  async getQuote(symbol: string): Promise<BondQuote> {
    const q = this.quotes.get(symbol);
    if (!q) throw new Error(`manual: no quote for ${symbol}`);
    return q;
  }
}
