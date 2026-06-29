"use client";

import { useMemo, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { computeScenario, type ScenarioBase } from "@/components/scenario";
import type { PositionAnalytics } from "@/components/portfolio";
import {
  STRESS_SCENARIOS,
  aggregateRisk,
  parametricVaR,
  riskContributions,
  riskHeatmap,
  stressShiftBps,
  topRisks,
  type ScenarioPoint,
  type StressResult,
} from "@/lib/risk";
import { useRiskBook } from "./use-risk-book";
import { RiskKPICards } from "./risk-kpi-cards";
import { RiskSummary } from "./risk-summary";
import { VaRPanel } from "./var-panel";
import { PortfolioExposure } from "./portfolio-exposure";
import { ScenarioRunner } from "./scenario-runner";
import { StressTestingPanel } from "./stress-testing-panel";
import { RiskContributionTable } from "./risk-contribution-table";
import { RiskHeatmap } from "./risk-heatmap";
import { RiskCharts } from "./risk-charts";

const QUICK_SHIFTS = [-200, -100, -50, 0, 50, 100, 200];

/** P&L (currency) of a position under a parallel yield shift, via the scenario engine. */
function positionPnl(a: PositionAnalytics, bps: number): number {
  if (bps === 0) return 0;
  const base: ScenarioBase = {
    bond: a.bond,
    ytm: a.yieldDecimal,
    clean0: a.cleanPrice,
    dirty0: a.dirtyPrice,
    modified: a.modifiedDuration,
    convexity: a.convexity,
    face: a.bond.faceValue,
  };
  const faceTotal = a.bond.faceValue * a.position.quantity;
  return (computeScenario(base, bps).exactChange / 100) * faceTotal;
}

/**
 * Risk Dashboard — fixed-income portfolio risk in real time. Every number comes
 * from the existing engines: pricing/duration/convexity/DV01 from the financial
 * engine (via the Portfolio's analyzePosition), scenario/stress repricing from
 * the scenario engine, and risk aggregation/VaR from `@/lib/risk`.
 */
export function RiskDashboard() {
  const { instruments, loading } = useRiskBook();
  const positions = useMemo(() => instruments.map((i) => i.risk), [instruments]);
  const agg = useMemo(() => aggregateRisk(positions), [positions]);

  const [shift, setShift] = useState(0);
  const [confidence, setConfidence] = useState(95);
  const [horizonDays, setHorizonDays] = useState(1);
  const [vol, setVol] = useState(6.5);

  const scenarioPoints = useMemo<ScenarioPoint[]>(() => {
    const mv = agg.marketValue;
    return QUICK_SHIFTS.map((bps) => {
      const pnl = instruments.reduce((s, i) => s + positionPnl(i.analytics, bps), 0);
      return { shiftBps: bps, newValue: mv + pnl, pnl, changePct: mv === 0 ? 0 : (pnl / mv) * 100 };
    });
  }, [instruments, agg.marketValue]);

  const stressResults = useMemo<StressResult[]>(() => {
    const mv = agg.marketValue;
    return STRESS_SCENARIOS.map((sc) => {
      const impact = instruments.reduce((s, i) => s + positionPnl(i.analytics, stressShiftBps(sc, i.risk.remainingYears)), 0);
      return { id: sc.id, label: sc.label, newValue: mv + impact, impact, impactPct: mv === 0 ? 0 : (impact / mv) * 100 };
    });
  }, [instruments, agg.marketValue]);

  const varResult = useMemo(
    () => parametricVaR({ dv01Currency: agg.dv01, dailyYieldVolBp: vol, confidence, horizonDays }),
    [agg.dv01, vol, confidence, horizonDays],
  );

  const contributions = useMemo(() => riskContributions(positions), [positions]);
  const heatmap = useMemo(() => riskHeatmap(positions), [positions]);
  const top = useMemo(() => topRisks(positions), [positions]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk Dashboard"
        description="Real-time fixed-income portfolio risk — exposure, sensitivity, stress and VaR."
        actions={<Badge variant="muted">{positions.length} holdings</Badge>}
      />

      {positions.length === 0 ? (
        <SectionCard>
          <EmptyState
            icon={ShieldAlert}
            title={loading ? "Loading portfolio…" : "No holdings to analyse"}
            description="Add positions in the Portfolio module to populate the risk dashboard."
          />
        </SectionCard>
      ) : (
        <>
          <RiskKPICards agg={agg} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <RiskSummary top={top} />
            </div>
            <VaRPanel
              confidence={confidence}
              horizonDays={horizonDays}
              vol={vol}
              onConfidence={setConfidence}
              onHorizon={setHorizonDays}
              onVol={setVol}
              result={varResult}
            />
          </div>

          <PortfolioExposure positions={positions} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <SectionCard title="Scenario Analysis" description="Parallel shifts across the whole book.">
              <ScenarioRunner points={scenarioPoints} selected={shift} onSelect={setShift} dv01={agg.dv01} />
            </SectionCard>
            <SectionCard title="Stress Testing" description="Predefined curve scenarios.">
              <StressTestingPanel results={stressResults} />
            </SectionCard>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <SectionCard title="Risk Contribution" description="Per-holding contribution to portfolio risk.">
              <RiskContributionTable contributions={contributions} />
            </SectionCard>
            <RiskHeatmap data={heatmap} />
          </div>

          <SectionCard title="Risk Charts" description="Exposure, duration, DV01, convexity and allocations.">
            <RiskCharts positions={positions} />
          </SectionCard>
        </>
      )}
    </div>
  );
}
