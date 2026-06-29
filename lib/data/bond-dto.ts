/**
 * @file bond-dto.ts
 * Raw data-transfer shape as it arrives from a data source (here: bundled JSON,
 * later: a REST/Bloomberg/Refinitiv API). Intentionally loose strings — the
 * {@link BondMapper} narrows these into the typed domain model.
 */

export interface BondDTO {
  ticker: string;
  isin: string;
  cusip: string | null;
  name: string;
  issuer: string;
  country: string;
  currency: string;
  coupon: number;
  couponType: string;
  frequency: string;
  issueDate: string;
  settlementDays: number;
  maturityDate: string;
  faceValue: number;
  dayCount: string;
  callable: boolean;
  puttable: boolean;
  inflationLinked: boolean;
  floatingRate: boolean;
  zeroCoupon: boolean;
  fixedRate: boolean;
  amortizationType: string;
  rating: string;
  sector: string;
  market: string;
  exchange: string;
  marketYield: number;
  marketPrice: number;
}
