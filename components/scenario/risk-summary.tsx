"use client";

import { MetricCard } from "@/components/fixed-income";
import { formatNumber } from "@/lib/utils/format";

/** Engine-derived risk figures at the base yield. */
export interface RiskSummaryData {
  dv01: number;
  pvbp: number;
  modifiedDuration: number;
  convexity: number;
  dollarDuration: number;
  effectiveDuration: number;
  currentYield: number;
  ytm: number;
}

interface RiskSummaryProps {
  data: RiskSummaryData;
}

/** Risk panel summarising the bond's sensitivities (all from the engine). */
export function RiskSummary({ data }: RiskSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MetricCard label="DV01" value={formatNumber(data.dv01, 5)} tooltip="Dollar value of 1bp, per 100 face." />
      <MetricCard label="PVBP" value={formatNumber(data.pvbp, 5)} tooltip="Price value of a basis point." />
      <MetricCard label="Modified Duration" value={`${formatNumber(data.modifiedDuration, 4)}y`} />
      <MetricCard label="Convexity" value={formatNumber(data.convexity, 4)} />
      <MetricCard label="Dollar Duration" value={formatNumber(data.dollarDuration, 4)} />
      <MetricCard label="Effective Duration" value={`${formatNumber(data.effectiveDuration, 4)}y`} />
      <MetricCard label="Current Yield" value={`${formatNumber(data.currentYield, 3)}%`} />
      <MetricCard label="Yield to Maturity" value={`${formatNumber(data.ytm * 100, 3)}%`} emphasis />
    </div>
  );
}
