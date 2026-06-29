/**
 * @file bond-service.ts
 * Service facade — the ONLY data API React components use. It wraps the
 * repository and enriches records with engine analytics (yield → modified
 * duration) for screening. All math comes from `@/lib/fixed-income`.
 */

import { durationMetrics } from "@/lib/fixed-income";
import { BondMapper } from "@/lib/mappers/bond-mapper";
import { JsonBondProvider } from "@/lib/providers/bond-provider";
import { BondRepository } from "@/lib/repositories/bond-repository";
import { ratingRank, RATING_SCALE, type BondRecord, type RatingClass } from "@/lib/data/bond-model";

/** Screening criteria (all optional; ranges are numbers). */
export interface ScreenCriteria {
  search?: string;
  country?: string;
  currency?: string;
  sector?: string;
  issuer?: string;
  couponMin?: number;
  couponMax?: number;
  yieldMin?: number;
  yieldMax?: number;
  durationMin?: number;
  durationMax?: number;
  maturityFromYear?: number;
  maturityToYear?: number;
  ratingClass?: RatingClass | "all";
}

/** A screening result: the record plus engine-derived analytics. */
export interface BondScreenResult {
  record: BondRecord;
  settlementDate: string;
  yieldPct: number;
  modifiedDuration: number;
}

function inRange(value: number, min?: number, max?: number): boolean {
  if (min !== undefined && value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
}

export class BondService {
  private readonly repo: BondRepository;

  constructor(repo: BondRepository) {
    this.repo = repo;
  }

  /** All domain records. */
  getAll(): Promise<BondRecord[]> {
    return this.repo.getAll();
  }

  /** One record by id. */
  getById(id: string): Promise<BondRecord | null> {
    return this.repo.getById(id);
  }

  /** Enrich a record with engine analytics (modified duration at market yield). */
  enrich(record: BondRecord): BondScreenResult {
    const settlementDate = BondMapper.settlementDate(record);
    let modifiedDuration = 0;
    try {
      const bond = BondMapper.toInstrument(record);
      modifiedDuration = durationMetrics(bond, record.marketYield / 100).modified;
    } catch {
      modifiedDuration = 0;
    }
    return { record, settlementDate, yieldPct: record.marketYield, modifiedDuration };
  }

  /** Run the screener: load → enrich (engine) → filter. */
  async screen(criteria: ScreenCriteria = {}): Promise<BondScreenResult[]> {
    const all = await this.repo.getAll();
    const enriched = all.map((r) => this.enrich(r));
    const q = criteria.search?.trim().toLowerCase() ?? "";

    return enriched.filter(({ record, modifiedDuration }) => {
      if (q) {
        const hay = [record.ticker, record.name, record.isin, record.issuer, record.country, record.currency]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (criteria.country && record.country !== criteria.country) return false;
      if (criteria.currency && record.currency !== criteria.currency) return false;
      if (criteria.sector && record.sector !== criteria.sector) return false;
      if (criteria.issuer && !record.issuer.toLowerCase().includes(criteria.issuer.toLowerCase())) return false;
      if (!inRange(record.coupon, criteria.couponMin, criteria.couponMax)) return false;
      if (!inRange(record.marketYield, criteria.yieldMin, criteria.yieldMax)) return false;
      if (!inRange(modifiedDuration, criteria.durationMin, criteria.durationMax)) return false;
      const matYear = new Date(record.maturityDate).getUTCFullYear();
      if (!inRange(matYear, criteria.maturityFromYear, criteria.maturityToYear)) return false;
      if (criteria.ratingClass && criteria.ratingClass !== "all" && record.ratingClass !== criteria.ratingClass) {
        return false;
      }
      return true;
    });
  }

  /** Distinct values for building filter dropdowns. */
  async facets(): Promise<{ countries: string[]; currencies: string[]; sectors: string[] }> {
    const all = await this.repo.getAll();
    const uniq = (xs: string[]) => [...new Set(xs)].sort();
    return {
      countries: uniq(all.map((b) => b.country)),
      currencies: uniq(all.map((b) => b.currency)),
      sectors: uniq(all.map((b) => b.sector)),
    };
  }
}

/** Default singleton wired to the bundled JSON provider. */
export const bondService = new BondService(new BondRepository(new JsonBondProvider()));

export { ratingRank, RATING_SCALE };
