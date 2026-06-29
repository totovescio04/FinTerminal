/**
 * @file bond-mapper.ts
 * DataMapper: converts a loose {@link BondDTO} into the strongly-typed
 * {@link BondRecord} domain model, and a {@link BondRecord} into the engine
 * instrument inputs. Keeping this boundary explicit means a new data source only
 * needs a DTO + this mapper — never a component change.
 */

import type { Bond, DayCountConvention, Frequency } from "@/lib/fixed-income";
import { createBond } from "@/lib/fixed-income";
import type { BondDTO } from "@/lib/data/bond-dto";
import {
  ratingClass,
  VALUATION_DATE,
  type AmortizationType,
  type BondRecord,
  type CouponType,
} from "@/lib/data/bond-model";

const FREQUENCIES: Frequency[] = ["Annual", "Semiannual", "Quarterly", "Monthly"];
const DAY_COUNTS: DayCountConvention[] = ["ACT/ACT", "30/360", "30E/360", "ACT/365", "ACT/360"];
const COUPON_TYPES: CouponType[] = ["Fixed", "Floating", "Zero", "InflationLinked", "Step"];
const AMORT_TYPES: AmortizationType[] = ["Bullet", "Amortizing", "Sinkable"];

function oneOf<T extends string>(value: string, allowed: T[], fallback: T): T {
  return (allowed as string[]).includes(value) ? (value as T) : fallback;
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Add whole days to an ISO date (UTC), returning an ISO date string. */
function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const BondMapper = {
  /** Narrow a raw DTO into the typed domain model. */
  toDomain(dto: BondDTO): BondRecord {
    return {
      id: dto.isin ? slug(dto.isin) : slug(`${dto.ticker}-${dto.maturityDate}`),
      ticker: dto.ticker,
      isin: dto.isin,
      cusip: dto.cusip ?? undefined,
      name: dto.name,
      issuer: dto.issuer,
      country: dto.country,
      currency: dto.currency,
      coupon: dto.coupon,
      couponType: oneOf(dto.couponType, COUPON_TYPES, "Fixed"),
      frequency: oneOf(dto.frequency, FREQUENCIES, "Semiannual"),
      issueDate: dto.issueDate,
      settlementDays: dto.settlementDays,
      maturityDate: dto.maturityDate,
      faceValue: dto.faceValue,
      dayCount: oneOf(dto.dayCount, DAY_COUNTS, "ACT/ACT"),
      callable: dto.callable,
      puttable: dto.puttable,
      inflationLinked: dto.inflationLinked,
      floatingRate: dto.floatingRate,
      fixedRate: dto.fixedRate,
      zeroCoupon: dto.zeroCoupon,
      amortizationType: oneOf(dto.amortizationType, AMORT_TYPES, "Bullet"),
      rating: dto.rating,
      ratingClass: ratingClass(dto.rating),
      sector: dto.sector,
      market: dto.market,
      exchange: dto.exchange,
      marketYield: dto.marketYield,
      marketPrice: dto.marketPrice,
    };
  },

  /** Settlement date derived from the valuation date and settlement days. */
  settlementDate(record: BondRecord): string {
    return addDays(VALUATION_DATE, record.settlementDays);
  },

  /**
   * Build the engine {@link Bond} for analytics. Floating/inflation/step bonds
   * are priced on their stated coupon (a fixed-rate approximation for screening).
   */
  toInstrument(record: BondRecord): Bond {
    return createBond({
      faceValue: record.faceValue,
      couponRate: record.coupon / 100,
      issueDate: new Date(record.issueDate),
      maturityDate: new Date(record.maturityDate),
      settlementDate: new Date(BondMapper.settlementDate(record)),
      frequency: record.frequency,
      dayCount: record.dayCount,
    });
  },
};
