"use client";

import { useEffect, useMemo, useState } from "react";
import { usePortfolio, analyzePosition, type PositionAnalytics } from "@/components/portfolio";
import { bondService } from "@/lib/services/bond-service";
import type { BondRecord } from "@/lib/data/bond-model";
import type { CouponType, RiskPosition } from "@/lib/risk";

/** A risk instrument: engine analytics + the derived RiskPosition. */
export interface RiskInstrument {
  analytics: PositionAnalytics;
  risk: RiskPosition;
}

const YEAR_MS = 365.25 * 86_400_000;

/**
 * Build the risk book from the Portfolio: every per-position number comes from
 * the financial engine (`analyzePosition`); reference metadata (issuer, country,
 * sector, rating, coupon type) is enriched from the Bond Database by ticker.
 */
export function useRiskBook(): { instruments: RiskInstrument[]; loading: boolean } {
  const positions = usePortfolio();
  const [records, setRecords] = useState<BondRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    bondService.getAll().then((all) => {
      if (active) {
        setRecords(all);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const instruments = useMemo<RiskInstrument[]>(() => {
    const byTicker = new Map(records.map((r) => [r.ticker.toLowerCase(), r]));
    return positions.map((pos) => {
      const a = analyzePosition(pos);
      const rec = byTicker.get(pos.ticker.toLowerCase());
      const couponType: CouponType = rec?.couponType ?? (pos.couponRate === 0 ? "Zero" : "Fixed");
      const remainingYears = (new Date(pos.maturityDate).getTime() - new Date(pos.settlementDate).getTime()) / YEAR_MS;
      const risk: RiskPosition = {
        id: pos.id,
        label: pos.ticker,
        issuer: rec?.issuer ?? pos.bondName,
        country: rec?.country ?? "Unknown",
        sector: rec?.sector ?? "Unknown",
        rating: rec?.rating ?? "NR",
        ratingClass: rec?.ratingClass ?? "NR",
        currency: pos.currency,
        couponType,
        marketValue: a.marketValue,
        yield: a.yieldDecimal,
        couponRate: pos.couponRate,
        remainingYears,
        wal: a.wal,
        modifiedDuration: a.modifiedDuration,
        macaulayDuration: a.macaulayDuration,
        dollarDuration: a.dollarDuration,
        convexity: a.convexity,
        dv01: a.dv01,
        pvbp: a.pvbp,
      };
      return { analytics: a, risk };
    });
  }, [positions, records]);

  return { instruments, loading };
}
