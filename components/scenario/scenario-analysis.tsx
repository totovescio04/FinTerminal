"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { useBondAnalytics } from "@/components/fixed-income";
import { useBondState } from "@/components/cash-flow";
import { HEATMAP_MATURITY_OFFSETS, HEATMAP_SHIFTS_BP, QUICK_SHIFTS_BP } from "./constants";
import {
  buildHeatmap,
  buildSensitivityCurve,
  computeScenario,
  computeScenarioSet,
  type ScenarioBase,
} from "./scenario-engine";
import { ScenarioToolbar } from "./scenario-toolbar";
import { ScenarioControls } from "./scenario-controls";
import { ScenarioCard } from "./scenario-card";
import { ScenarioMetrics } from "./scenario-metrics";
import { RiskSummary, type RiskSummaryData } from "./risk-summary";
import { ScenarioChart } from "./scenario-chart";
import { ErrorChart } from "./error-chart";
import { WaterfallChart } from "./waterfall-chart";
import { SensitivityHeatmap } from "./sensitivity-heatmap";
import { ScenarioTable } from "./scenario-table";

/**
 * Scenario Analysis — institutional rate-shock workspace.
 *
 * Reads the active bond from the shared store (set by the calculator / viewer),
 * derives base analytics through the engine, and recomputes every scenario in
 * real time. No financial formula is implemented here — exact prices come from
 * `priceFromYield`; duration/convexity effects combine engine sensitivities.
 */
export function ScenarioAnalysis() {
  const { values, mode } = useBondState();
  const analytics = useBondAnalytics(values, mode);
  const [shiftBps, setShiftBps] = useState(0);

  const base = useMemo<ScenarioBase | null>(() => {
    if (!analytics.ok) return null;
    return {
      bond: analytics.bond,
      ytm: analytics.yieldDecimal,
      clean0: analytics.pricing.cleanPrice,
      dirty0: analytics.pricing.dirtyPrice,
      modified: analytics.durations.modified,
      convexity: analytics.risk.convexity,
      face: analytics.bond.faceValue,
    };
  }, [analytics]);

  // Shift-independent series (recomputed only when the bond changes).
  const board = useMemo(() => {
    if (!base) return null;
    return {
      quickSet: computeScenarioSet(base, QUICK_SHIFTS_BP),
      curve: buildSensitivityCurve(base.bond, base.ytm),
      heatmap: buildHeatmap(base.bond, base.ytm, HEATMAP_SHIFTS_BP, HEATMAP_MATURITY_OFFSETS),
    };
  }, [base]);

  const result = useMemo(() => (base ? computeScenario(base, shiftBps) : null), [base, shiftBps]);

  const riskData = useMemo<RiskSummaryData | null>(() => {
    if (!analytics.ok) return null;
    return {
      dv01: analytics.risk.dv01,
      pvbp: analytics.risk.pvbp,
      modifiedDuration: analytics.durations.modified,
      convexity: analytics.risk.convexity,
      dollarDuration: analytics.durations.dollar,
      effectiveDuration: analytics.durations.effective,
      currentYield: analytics.currentYield,
      ytm: analytics.yieldDecimal,
    };
  }, [analytics]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scenario Analysis"
        description="Stress the active bond against parallel rate shifts — exact vs. duration vs. convexity."
        actions={<Badge variant="muted">Live</Badge>}
      />

      <AnimatePresence>
        {!analytics.ok && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm text-destructive"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{analytics.error} — set a valid bond in the Calculator or Cash Flow Viewer.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {base && result && board && riskData ? (
        <>
          <ScenarioToolbar bondName={values.bondName} ticker={values.ticker} shiftBps={shiftBps} onReset={() => setShiftBps(0)} />

          {/* Section 1 (controls) + Section 2 (results) */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <SectionCard title="Scenario Controls" description="Pick a parallel shift — everything updates live.">
                <ScenarioControls shiftBps={shiftBps} onChange={setShiftBps} />
              </SectionCard>
            </div>
            <div className="space-y-4 xl:col-span-8">
              <motion.div
                key={shiftBps}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <ScenarioMetrics result={result} />
                <ScenarioCard result={result} />
              </motion.div>
            </div>
          </div>

          {/* Risk summary */}
          <SectionCard title="Risk Summary" description="Engine sensitivities at the current yield.">
            <RiskSummary data={riskData} />
          </SectionCard>

          {/* Section 3: charts */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <ScenarioChart
              data={board.curve}
              baseYieldPct={base.ytm * 100}
              basePrice={base.clean0}
              scenarioYieldPct={result.newYieldPct}
              scenarioPrice={result.exactClean}
            />
            <ErrorChart scenarios={board.quickSet} />
            <WaterfallChart result={result} basePrice={base.clean0} />
            <SensitivityHeatmap cells={board.heatmap} shiftsBp={HEATMAP_SHIFTS_BP} maturityOffsets={HEATMAP_MATURITY_OFFSETS} />
          </div>

          {/* Section 4: sensitivity table */}
          <SectionCard title="Sensitivity Table" description="Exact vs. estimated prices and approximation error per scenario.">
            <ScenarioTable scenarios={board.quickSet} selectedShift={shiftBps} />
          </SectionCard>
        </>
      ) : (
        <SectionCard>
          <EmptyState title="No active bond" description="Define a bond in the Calculator or Cash Flow Viewer to run scenarios." />
        </SectionCard>
      )}
    </div>
  );
}
