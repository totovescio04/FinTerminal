/**
 * @file redis-cache.ts
 * Redis-backed cache stub. Implements the same {@link CacheStore} interface, so
 * switching from in-memory to Redis is a one-line change in the repository
 * wiring — no caller changes. Wire a real client (e.g. ioredis) in the marked
 * spots.
 */

import type { CacheStore } from "@/lib/market-data/interfaces";

/** Minimal client surface this store needs (satisfied by ioredis/node-redis). */
export interface RedisLike {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, mode: "PX", ttl: number): Promise<unknown>;
  del(key: string): Promise<unknown>;
  flushdb(): Promise<unknown>;
}

export class RedisCacheStore implements CacheStore {
  private readonly client: RedisLike;

  constructor(client: RedisLike) {
    this.client = client;
  }

  async get<T>(key: string): Promise<T | undefined> {
    const raw = await this.client.get(key);
    return raw === null ? undefined : (JSON.parse(raw) as T);
  }

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value), "PX", ttlMs);
  }

  async has(key: string): Promise<boolean> {
    return (await this.client.get(key)) !== null;
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async clear(): Promise<void> {
    await this.client.flushdb();
  }
}
