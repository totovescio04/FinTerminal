"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  applyScenario,
  bootstrap,
  computeAnalytics,
  curveTable,
  tenorToYears,
  validateBootstrapInputs,
  type InterpolationMethod,
  type ScenarioType,
} from "@/lib/yield-curve";
import { buildComparisonSeries, buildCurveSeries } from "./series";
import { SpotCurveChart } from "./spot-curve-chart";
import { ForwardCurveChart } from "./forward-curve-chart";
import { DiscountCurveChart } from "./discount-curve-chart";
import { CurveComparison } from "./curve-comparison";
import { CurveAnalytics } from "./curve-analytics";
import { CurveTable } from "./curve-table";
import { InterpolationSelector } from "./interpolation-selector";
import { ScenarioControls } from "./scenario-controls";

interface ParInput {
  label: string;
  pct: number;
}

const DEFAULT_PARS: ParInput[] = [
  { label: "1M", pct: 4.9 },
  { label: "3M", pct: 4.8 },
  { label: "6M", pct: 4.6 },
  { label: "1Y", pct: 4.45 },
  { label: "2Y", pct: 4.2 },
  { label: "3Y", pct: 4.15 },
  { label: "5Y", pct: 4.2 },
  { label: "7Y", pct: 4.3 },
  { label: "10Y", pct: 4.45 },
  { label: "20Y", pct: 4.8 },
  { label: "30Y", pct: 4.9 },
];

/**
 * Yield Curve Builder — bootstrap a curve from par yields, choose interpolation,
 * apply scenarios, and view spot/forward/discount curves, analytics and table.
 * All math comes from `@/lib/yield-curve`.
 */
export function YieldCurveBuilder() {
  const [pars, setPars] = useState<ParInput[]>(DEFAULT_PARS);
  const [interpolation, setInterpolation] = useState<InterpolationMethod>("linear");
  const [scenarioType, setScenarioType] = useState<ScenarioType>("parallel");
  const [bps, setBps] = useState(0);

  const setPct = (index: number, value: number) =>
    setPars((prev) => prev.map((p, i) => (i === index ? { ...p, pct: value } : p)));

  const built = useMemo(() => {
    try {
      const inputs = pars.map((p) => ({ tenor: tenorToYears(p.label), parRate: p.pct / 100 }));
      validateBootstrapInputs(inputs);
      const base = bootstrap(inputs, { interpolation });
      const scenario = bps !== 0 ? applyScenario(base, { type: scenarioType, bps }) : base;
      const active = bps !== 0 ? scenario : base;
      const nodeTenors = inputs.map((i) => i.tenor);
      return {
        ok: true as const,
        baseSeries: buildCurveSeries(active),
        comparison: buildComparisonSeries(base, scenario),
        analytics: computeAnalytics(active),
        table: curveTable(active, nodeTenors),
      };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Invalid curve inputs" };
    }
  }, [pars, interpolation, scenarioType, bps]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Yield Curve Engine"
        description="Bootstrap spot, forward and discount curves from par yields — with scenarios and analytics."
        actions={<Badge variant="muted">Live</Badge>}
      />

      {!built.ok && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{built.error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-4">
          <SectionCard title="Curve Builder" description="Par yields by tenor — the curve rebuilds instantly.">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {pars.map((p, i) => (
                <div key={p.label} className="space-y-1">
                  <Label className="text-xs">{p.label}</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      value={Number.isFinite(p.pct) ? String(p.pct) : ""}
                      onChange={(e) => setPct(i, e.target.value === "" ? NaN : Number(e.target.value))}
                      className="h-8 pr-6 text-sm tabular-nums"
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Method & Scenario">
            <div className="space-y-4">
              <InterpolationSelector value={interpolation} onChange={setInterpolation} />
              <ScenarioControls type={scenarioType} bps={bps} onTypeChange={setScenarioType} onBpsChange={setBps} onReset={() => setBps(0)} />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6 xl:col-span-8">
          {built.ok && (
            <>
              <CurveAnalytics analytics={built.analytics} />
              <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
                <SpotCurveChart data={built.baseSeries} />
                <ForwardCurveChart data={built.baseSeries} />
                <DiscountCurveChart data={built.baseSeries} />
                <CurveComparison data={built.comparison} />
              </div>
              <SectionCard title="Curve Table" description="Maturity · spot · forward · discount · zero.">
                <CurveTable rows={built.table} />
              </SectionCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
