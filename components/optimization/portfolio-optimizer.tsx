"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  DEFAULT_CONSTRAINTS,
  buildBounds,
  efficientFrontier,
  monteCarlo,
  optimize,
  portfolioStats,
  type Constraints,
  type Objective,
} from "@/lib/portfolio-optimization";
import { useOptimizationInputs, type OptAsset } from "./use-optimization-inputs";
import { OptimizationPanel } from "./optimization-panel";
import { OptimizationResults, type PortfolioAggregates } from "./optimization-results";
import { OptimizationSummary, type ComparisonRow } from "./optimization-summary";
import { EfficientFrontierChart } from "./efficient-frontier-chart";
import { MonteCarloChart } from "./monte-carlo-chart";
import { RiskReturnChart } from "./risk-return-chart";
import { AllocationChart } from "./allocation-chart";
import { CorrelationHeatmap } from "./correlation-heatmap";

function aggregate(weights: number[], assets: OptAsset[], totalMv: number): PortfolioAggregates {
  const w = (sel: (a: OptAsset) => number) => assets.reduce((s, a, i) => s + (weights[i] ?? 0) * sel(a), 0);
  return {
    yield: w((a) => a.yield),
    duration: w((a) => a.modifiedDuration),
    convexity: w((a) => a.convexity),
    dv01: totalMv * w((a) => a.dv01PerMv),
  };
}

/**
 * Portfolio Optimizer — builds μ/Σ from the portfolio (engine yields/durations),
 * runs the optimization engine and shows the frontier, Monte-Carlo cloud,
 * allocation and a current-vs-optimized comparison. All inputs derive from the
 * existing engines; the optimization math lives in `@/lib/portfolio-optimization`.
 */
export function PortfolioOptimizer() {
  const inputs = useOptimizationInputs();
  const { assets, mu, Sigma, corr, currentWeights, totalMarketValue } = inputs;

  const [objective, setObjective] = useState<Objective>("maxSharpe");
  const [constraints, setConstraints] = useState<Constraints>({ ...DEFAULT_CONSTRAINTS, maxWeight: 0.4 });
  const [targetReturn, setTargetReturn] = useState(0.05);
  const [targetRisk, setTargetRisk] = useState(0.05);
  const [riskFree, setRiskFree] = useState(0.04);

  const computed = useMemo(() => {
    if (assets.length < 2) return null;
    try {
      const bounds = buildBounds(assets.length, constraints);
      const result = optimize({ expectedReturns: mu, covariance: Sigma, objective, constraints, riskFreeRate: riskFree, targetReturn, targetRisk });
      const frontier = efficientFrontier(mu, Sigma, bounds, 50, riskFree);
      const mc = monteCarlo(mu, Sigma, bounds, 5000, 12345, riskFree);
      const currentStats = portfolioStats(currentWeights, mu, Sigma, riskFree);
      const aggCurrent = aggregate(currentWeights, assets, totalMarketValue);
      const aggOpt = aggregate(result.weights, assets, totalMarketValue);
      const minVar = frontier.reduce((b, p) => (p.volatility < b.volatility ? p : b), frontier[0]!);
      const maxSharpe = frontier.reduce((b, p) => (p.sharpe > b.sharpe ? p : b), frontier[0]!);
      return { result, frontier, mc, currentStats, aggCurrent, aggOpt, minVar, maxSharpe, ok: true as const };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Optimization failed" };
    }
  }, [assets, mu, Sigma, objective, constraints, riskFree, targetReturn, targetRisk, currentWeights, totalMarketValue]);

  const comparison: ComparisonRow[] = computed && computed.ok
    ? [
        { metric: "Expected Return", current: computed.currentStats.expectedReturn, optimized: computed.result.expectedReturn, format: "pct", better: "high" },
        { metric: "Volatility", current: computed.currentStats.volatility, optimized: computed.result.volatility, format: "pct", better: "low" },
        { metric: "Sharpe", current: computed.currentStats.sharpe, optimized: computed.result.sharpe, format: "num", better: "high" },
        { metric: "Yield", current: computed.aggCurrent.yield, optimized: computed.aggOpt.yield, format: "pct", better: "high" },
        { metric: "Duration", current: computed.aggCurrent.duration, optimized: computed.aggOpt.duration, format: "num", better: "low" },
        { metric: "Convexity", current: computed.aggCurrent.convexity, optimized: computed.aggOpt.convexity, format: "num", better: "high" },
        { metric: "DV01", current: computed.aggCurrent.dv01, optimized: computed.aggOpt.dv01, format: "money", better: "low" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio Optimizer"
        description="Mean-variance optimization across your fixed-income book — frontier, Monte-Carlo and constraints."
        actions={<Badge variant="muted">{assets.length} assets</Badge>}
      />

      {assets.length < 2 ? (
        <SectionCard>
          <EmptyState icon={Sparkles} title="Need at least 2 holdings" description="Add positions in the Portfolio module to optimize." />
        </SectionCard>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-3">
            <SectionCard title="Optimizer" description="Objective & constraints — recomputes live.">
              <OptimizationPanel
                objective={objective}
                constraints={constraints}
                targetReturn={targetReturn}
                targetRisk={targetRisk}
                riskFree={riskFree}
                onObjective={setObjective}
                onConstraints={(patch) => setConstraints((c) => ({ ...c, ...patch }))}
                onTargetReturn={setTargetReturn}
                onTargetRisk={setTargetRisk}
                onRiskFree={setRiskFree}
              />
            </SectionCard>
          </div>

          <div className="space-y-6 xl:col-span-9">
            {!computed || !computed.ok ? (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{computed && !computed.ok ? computed.error : "Adjust constraints."}</span>
              </div>
            ) : (
              <>
                <SectionCard title="Optimal Portfolio">
                  <OptimizationResults result={computed.result} assets={assets} aggregates={computed.aggOpt} />
                </SectionCard>

                <OptimizationSummary rows={comparison} />

                <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
                  <EfficientFrontierChart
                    frontier={computed.frontier}
                    current={{ vol: computed.currentStats.volatility, ret: computed.currentStats.expectedReturn }}
                    minVar={{ vol: computed.minVar.volatility, ret: computed.minVar.expectedReturn }}
                    maxSharpe={{ vol: computed.maxSharpe.volatility, ret: computed.maxSharpe.expectedReturn }}
                  />
                  <MonteCarloChart
                    portfolios={computed.mc.portfolios}
                    minVar={computed.mc.minVariance}
                    maxSharpe={computed.mc.maxSharpe}
                    current={{ vol: computed.currentStats.volatility, ret: computed.currentStats.expectedReturn }}
                  />
                  <RiskReturnChart assets={assets} />
                  <AllocationChart weights={computed.result.weights} assets={assets} cash={computed.result.cash} />
                </div>

                <CorrelationHeatmap corr={corr} labels={assets.map((a) => a.label)} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
