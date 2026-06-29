/**
 * @file memory-cache.ts
 * In-memory TTL cache (the default {@link CacheStore}). Swap for Redis by
 * implementing the same interface — see {@link RedisCacheStore}.
 */

import type { CacheStore } from "@/lib/market-data/interfaces";

interface Entry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCacheStore implements CacheStore {
  private store = new Map<string, Entry<unknown>>();

  async get<T>(key: string): Promise<T | undefined> {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  async has(key: string): Promise<boolean> {
    return (await this.get(key)) !== undefined;
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}
