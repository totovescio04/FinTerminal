"use client";

import { useMemo, useState } from "react";
import { Download, GitCompareArrows } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatNumber } from "@/lib/utils/format";
import { useBondAnalytics, DEFAULT_BOND_FORM, type BondAnalytics } from "@/components/fixed-income";
import { ScenarioControls, computeScenario, type ScenarioBase } from "@/components/scenario";
import { ustYield } from "./instrument";
import { BOND_COLORS, type ComparatorBond, type ComparisonResult } from "./types";
import { BondSelector } from "./bond-selector";
import { ComparisonSummary } from "./comparison-summary";
import { ComparisonTable } from "./comparison-table";
import { SpreadAnalysis } from "./spread-analysis";
import { RankingTable } from "./ranking-table";
import { ComparisonCharts } from "./comparison-charts";
import { exportComparison } from "./export";

const remainingYears = (form: { settlementDate: string; maturityDate: string }) =>
  (new Date(form.maturityDate).getTime() - new Date(form.settlementDate).getTime()) / (365.25 * 86_400_000);

/**
 * Bond Comparator — compare up to 4 bonds side by side. Every metric is read
 * from the financial engine (`useBondAnalytics`); scenarios use the scenario
 * engine; spreads use the yield-curve engine. No math is duplicated here.
 */
export function BondComparator() {
  const [selected, setSelected] = useState<ComparatorBond[]>([]);
  const [shiftBps, setShiftBps] = useState(0);

  // Fixed 4 analytics slots (Rules of Hooks): empty slots use a valid default.
  const a0 = useBondAnalytics(selected[0]?.form ?? DEFAULT_BOND_FORM, "yield");
  const a1 = useBondAnalytics(selected[1]?.form ?? DEFAULT_BOND_FORM, "yield");
  const a2 = useBondAnalytics(selected[2]?.form ?? DEFAULT_BOND_FORM, "yield");
  const a3 = useBondAnalytics(selected[3]?.form ?? DEFAULT_BOND_FORM, "yield");
  const slots: BondAnalytics[] = [a0, a1, a2, a3];

  const results = useMemo<ComparisonResult[]>(() => {
    const out: ComparisonResult[] = [];
    selected.forEach((bond, i) => {
      const a = slots[i]!;
      if (!a.ok) return;
      const cfs = a.cashFlows;
      const totalPrincipal = cfs.reduce((s, c) => s + c.principalAmount, 0);
      const wal = totalPrincipal === 0 ? 0 : cfs.reduce((s, c) => s + c.yearFraction * c.principalAmount, 0) / totalPrincipal;
      const ry = remainingYears(bond.form);
      const ustSpreadBps = (a.yieldDecimal - ustYield(ry)) * 10000;
      let scenario = null;
      if (shiftBps !== 0) {
        const base: ScenarioBase = {
          bond: a.bond,
          ytm: a.yieldDecimal,
          clean0: a.pricing.cleanPrice,
          dirty0: a.pricing.dirtyPrice,
          modified: a.durations.modified,
          convexity: a.risk.convexity,
          face: a.bond.faceValue,
        };
        scenario = computeScenario(base, shiftBps);
      }
      out.push({ bond, color: BOND_COLORS[i] ?? BOND_COLORS[0], analytics: a, scenario, ustSpreadBps, remainingYears: ry, wal });
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, a0, a1, a2, a3, shiftBps]);

  const add = (bond: ComparatorBond) => setSelected((prev) => (prev.length >= 4 || prev.some((b) => b.id === bond.id) ? prev : [...prev, bond]));
  const remove = (id: string) => setSelected((prev) => prev.filter((b) => b.id !== id));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bond Comparator"
        description="Compare up to 4 bonds across pricing, risk, cash flows and scenarios."
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={results.length === 0}>
                <Download className="h-4 w-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => exportComparison("csv", results)}>CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportComparison("excel", results)}>Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportComparison("pdf", results)}>PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-3">
          <SectionCard title="Select Bonds" description="Up to 4 from Database, Watchlist or Portfolio.">
            <BondSelector selected={selected} onAdd={add} onRemove={remove} />
          </SectionCard>
          <SectionCard title="Scenario" description="Apply a shift to all bonds at once.">
            <ScenarioControls shiftBps={shiftBps} onChange={setShiftBps} />
          </SectionCard>
        </div>

        <div className="space-y-6 xl:col-span-9">
          {results.length === 0 ? (
            <SectionCard>
              <EmptyState icon={GitCompareArrows} title="Select bonds to compare" description="Add up to four bonds from the left panel." />
            </SectionCard>
          ) : (
            <>
              <ComparisonSummary results={results} />
              {shiftBps !== 0 && (
                <SectionCard title={`Scenario impact (${shiftBps > 0 ? "+" : ""}${shiftBps} bp)`}>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {results.map((r) => (
                      <div key={r.bond.id} className="rounded-lg border border-border p-3">
                        <p className="flex items-center gap-1.5 text-sm font-medium">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                          {r.bond.ticker}
                        </p>
                        <p className={`mt-1 text-lg font-semibold tabular-nums ${r.scenario && r.scenario.exactChange >= 0 ? "text-positive" : "text-negative"}`}>
                          {r.scenario ? `${r.scenario.exactChange >= 0 ? "+" : ""}${formatNumber(r.scenario.exactChange, 3)}` : "—"}
                        </p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          {r.scenario ? `${formatNumber(r.scenario.exactChangePct, 2)}% · new ${formatNumber(r.scenario.exactClean, 2)}` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}
              <SectionCard title="Metric Comparison" description="Best value per metric is highlighted.">
                <ComparisonTable results={results} />
              </SectionCard>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <SpreadAnalysis results={results} />
                <RankingTable results={results} />
              </div>
            </>
          )}
        </div>
      </div>

      {results.length > 0 && (
        <SectionCard title="Comparative Charts" description="Price/yield, duration, convexity, cash flows, curve and PV.">
          <ComparisonCharts results={results} />
        </SectionCard>
      )}
    </div>
  );
}
