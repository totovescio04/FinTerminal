"use client";

import { MetricCard } from "./metric-card";
import { PricingCard } from "./pricing-card";
import { YieldCard } from "./yield-card";
import { DurationCard } from "./duration-card";
import { RiskCard } from "./risk-card";
import { formatDate } from "./format";
import type { BondAnalytics } from "./use-bond-analytics";

interface BondMetricsProps {
  analytics: BondAnalytics;
  loading?: boolean;
}

/** Center column: all real-time KPIs sourced from the fixed-income engine. */
export function BondMetrics({ analytics, loading = false }: BondMetricsProps) {
  const a = analytics.ok ? analytics : null;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Remaining Coupons"
          value={a ? String(a.remainingCoupons) : "—"}
          loading={loading}
          tooltip="Number of coupon payments after settlement."
        />
        <MetricCard
          label="Maturity"
          value={a ? formatDate(a.bond.maturityDate) : "—"}
          loading={loading}
          tooltip="Redemption date of the bond."
        />
      </div>

      <PricingCard
        cleanPrice={a?.pricing.cleanPrice}
        dirtyPrice={a?.pricing.dirtyPrice}
        accruedInterest={a?.pricing.accruedInterest}
        marketValue={a?.marketValue}
        loading={loading}
      />
      <YieldCard ytm={a ? a.yieldDecimal * 100 : undefined} currentYield={a?.currentYield} loading={loading} />
      <DurationCard
        macaulay={a?.durations.macaulay}
        modified={a?.durations.modified}
        dollar={a?.durations.dollar}
        loading={loading}
      />
      <RiskCard
        dv01={a?.risk.dv01}
        pvbp={a?.risk.pvbp}
        convexity={a?.risk.convexity}
        loading={loading}
      />
    </div>
  );
}
