/**
 * @file bond-repository.ts
 * Repository: hides the data source behind a clean domain API. It pulls DTOs
 * from a {@link BondDataProvider}, maps them to {@link BondRecord}s once, caches
 * the result, and exposes lookup/search. Components never touch the provider or
 * the JSON directly — only the repository (through the service).
 */

import type { BondRecord } from "@/lib/data/bond-model";
import type { BondDataProvider } from "@/lib/providers/bond-provider";
import { BondMapper } from "@/lib/mappers/bond-mapper";

export class BondRepository {
  private cache: BondRecord[] | null = null;
  private readonly provider: BondDataProvider;

  constructor(provider: BondDataProvider) {
    this.provider = provider;
  }

  /** All domain records (mapped once and cached). */
  async getAll(): Promise<BondRecord[]> {
    if (this.cache === null) {
      const dtos = await this.provider.fetchAll();
      this.cache = dtos.map((dto) => BondMapper.toDomain(dto));
    }
    return this.cache;
  }

  /** Single record by domain id, or null. */
  async getById(id: string): Promise<BondRecord | null> {
    const all = await this.getAll();
    return all.find((b) => b.id === id) ?? null;
  }

  /** Free-text search across ticker, name, ISIN, issuer, country and currency. */
  async search(query: string): Promise<BondRecord[]> {
    const all = await this.getAll();
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((b) =>
      [b.ticker, b.name, b.isin, b.issuer, b.country, b.currency]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }

  /** Clear the cache (e.g. after switching providers). */
  invalidate(): void {
    this.cache = null;
  }
}
