"use client";

import { PortfolioAllocationChart } from "./portfolio-allocation-chart";
import { DurationContributionChart } from "./duration-contribution-chart";
import { YieldDistributionChart } from "./yield-distribution-chart";
import { MaturityLadderChart } from "./maturity-ladder-chart";
import { CashFlowProjectionChart } from "./cash-flow-projection-chart";
import { RiskContributionChart } from "./risk-contribution-chart";
import type { PortfolioAnalytics } from "./types";

interface PortfolioChartsProps {
  data: PortfolioAnalytics;
}

/** Grid of portfolio visualizations (all derived from engine output). */
export function PortfolioCharts({ data }: PortfolioChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <PortfolioAllocationChart data={data.allocationByAsset} />
      <DurationContributionChart positions={data.positions} />
      <YieldDistributionChart positions={data.positions} />
      <MaturityLadderChart data={data.allocationByMaturity} />
      <CashFlowProjectionChart data={data.aggregatedCashFlows} />
      <RiskContributionChart positions={data.positions} />
    </div>
  );
}
