import type { RiskPosition } from "../types";

export const POSITIONS: RiskPosition[] = [
  { id: "a", label: "BND-A", issuer: "Issuer A", country: "United States", sector: "Sovereign", rating: "AA+", ratingClass: "IG", currency: "USD", couponType: "Fixed", marketValue: 1_000_000, yield: 0.05, couponRate: 5, remainingYears: 2, wal: 2, modifiedDuration: 2, macaulayDuration: 2.1, dollarDuration: 2, convexity: 10, dv01: 100, pvbp: 100 },
  { id: "b", label: "BND-B", issuer: "Issuer B", country: "United States", sector: "Corporate", rating: "BBB", ratingClass: "IG", currency: "USD", couponType: "Fixed", marketValue: 2_000_000, yield: 0.06, couponRate: 4, remainingYears: 6, wal: 6, modifiedDuration: 6, macaulayDuration: 6.2, dollarDuration: 6, convexity: 40, dv01: 300, pvbp: 300 },
  { id: "c", label: "BND-C", issuer: "Issuer A", country: "Germany", sector: "Sovereign", rating: "CCC", ratingClass: "HY", currency: "EUR", couponType: "Zero", marketValue: 1_000_000, yield: 0.13, couponRate: 0, remainingYears: 12, wal: 12, modifiedDuration: 10, macaulayDuration: 10, dollarDuration: 10, convexity: 90, dv01: 500, pvbp: 500 },
];
