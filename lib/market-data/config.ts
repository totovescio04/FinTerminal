/**
 * @file config.ts
 * Cache TTLs and the default provider chain. The repository tries providers in
 * order and falls back to the next on failure; the local provider is last so it
 * always backstops (offline-safe).
 */

import type { MarketDataProvider } from "./interfaces";
import {
  AlphaVantageProvider,
  BloombergProvider,
  FmpProvider,
  LocalJsonProvider,
  ManualProvider,
  MarketAxessProvider,
  OpenFigiProvider,
  PolygonProvider,
  RefinitivProvider,
} from "./providers";

/** Per-capability cache TTLs (ms). */
export const MARKET_DATA_TTL = {
  quote: 15_000,
  curve: 60_000,
  fx: 30_000,
  history: 300_000,
  snapshot: 15_000,
  issuer: 86_400_000,
  benchmark: 60_000,
} as const;

/**
 * Default provider chain (priority order). Vendors are tried first; the local
 * provider backstops. Configure a vendor with credentials to activate it.
 */
export function createDefaultProviders(): MarketDataProvider[] {
  return [
    new BloombergProvider(),
    new RefinitivProvider(),
    new MarketAxessProvider(),
    new OpenFigiProvider(),
    new PolygonProvider(),
    new FmpProvider(),
    new AlphaVantageProvider(),
    new ManualProvider(),
    new LocalJsonProvider(),
  ];
}
