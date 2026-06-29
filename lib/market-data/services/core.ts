/**
 * @file core.ts
 * Shared repository singleton wired to the default provider chain and an
 * in-memory TTL cache. Swap the cache for {@link RedisCacheStore} or change the
 * provider order here — nothing else changes.
 */

import { MemoryCacheStore } from "@/lib/market-data/cache";
import { createDefaultProviders } from "@/lib/market-data/config";
import { MarketDataRepository } from "@/lib/market-data/repositories";

export const marketDataRepository = new MarketDataRepository(
  createDefaultProviders(),
  new MemoryCacheStore(),
);
