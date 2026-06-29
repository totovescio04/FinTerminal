/**
 * @file cache.ts
 * Cache abstraction. The in-memory implementation can be swapped for Redis (or
 * any KV store) without touching callers — they depend on this interface only.
 */

export interface CacheStore {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttlMs: number): Promise<void>;
  has(key: string): Promise<boolean>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}
