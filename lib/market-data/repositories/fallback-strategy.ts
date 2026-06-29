/**
 * @file fallback-strategy.ts
 * Strategy Pattern for source selection. {@link FallbackStrategy} tries each
 * capable, available provider in priority order and returns the first success,
 * collecting errors for diagnostics.
 */

import type { MarketDataProvider } from "@/lib/market-data/interfaces";
import type { ProviderCapability, ProviderId } from "@/lib/market-data/types";

export interface ResolvedValue<T> {
  value: T;
  provider: ProviderId;
}

export interface ProviderSelectionStrategy {
  resolve<T>(
    providers: MarketDataProvider[],
    capability: ProviderCapability,
    call: (provider: MarketDataProvider) => Promise<T>,
  ): Promise<ResolvedValue<T>>;
}

export class FallbackStrategy implements ProviderSelectionStrategy {
  async resolve<T>(
    providers: MarketDataProvider[],
    capability: ProviderCapability,
    call: (provider: MarketDataProvider) => Promise<T>,
  ): Promise<ResolvedValue<T>> {
    const errors: string[] = [];
    for (const provider of providers) {
      if (!provider.capabilities.includes(capability)) continue;
      try {
        if (!(await provider.isAvailable())) continue;
        const value = await call(provider);
        return { value, provider: provider.id };
      } catch (error) {
        errors.push(`${provider.id}: ${error instanceof Error ? error.message : "error"}`);
      }
    }
    throw new Error(`No provider could serve "${capability}". Tried: ${errors.join("; ") || "none"}`);
  }
}
