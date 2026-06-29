"use client";

import { MetricCard } from "./metric-card";
import { MetricGroup } from "./metric-group";
import { money, num } from "./format";

interface PricingCardProps {
  cleanPrice?: number;
  dirtyPrice?: number;
  accruedInterest?: number;
  marketValue?: number;
  loading?: boolean;
}

/** Pricing metrics: clean, dirty, accrued and market value (all from engine). */
export function PricingCard({
  cleanPrice,
  dirtyPrice,
  accruedInterest,
  marketValue,
  loading,
}: PricingCardProps) {
  return (
    <MetricGroup title="Pricing">
      <MetricCard label="Clean Price" value={num(cleanPrice)} loading={loading} emphasis tooltip="Quoted price per 100 face, excluding accrued interest." />
      <MetricCard label="Dirty Price" value={num(dirtyPrice)} loading={loading} tooltip="Full price per 100 face = clean price + accrued interest." />
      <MetricCard label="Accrued Interest" value={num(accruedInterest)} loading={loading} tooltip="Interest earned since the last coupon, per 100 face." />
      <MetricCard label="Market Value" value={money(marketValue)} loading={loading} tooltip="Dirty price scaled to the bond's face value." />
    </MetricGroup>
  );
}
