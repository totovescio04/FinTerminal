"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils/format";
import {
  BondForm,
  bondFormSchema,
  useBondAnalytics,
  type BondFormValues,
  type PriceMode,
} from "@/components/fixed-income";
import { getBondState, setBondMode, setBondValues } from "./bond-store";
import {
  buildCashFlowSummary,
  buildConvexitySeries,
  buildDiscountSeries,
  buildDurationSeries,
  buildPriceYieldSeries,
  buildPvSeries,
  buildTimelineSeries,
} from "./analytics-series";
import { CashFlowKpiBar } from "./cash-flow-kpi-bar";
import { PriceYieldChart } from "./price-yield-chart";
import { ConvexityChart } from "./convexity-chart";
import { TimelineChart } from "./timeline-chart";
import { PresentValueChart } from "./present-value-chart";
import { DurationChart } from "./duration-chart";
import { DiscountFactorChart } from "./discount-factor-chart";
import { CashFlowTable } from "./cash-flow-table";

const round6 = (n: number) => Math.round(n * 1e6) / 1e6;

/**
 * Cash Flow Viewer + Visual Analytics.
 *
 * Reads the active bond (shared store, seeded from the calculator defaults),
 * recomputes engine analytics on every change, and feeds the table + 6 charts.
 * No financial math lives here — every series is derived from engine output.
 */
export function CashFlowViewer() {
  const [initial] = useState(() => getBondState());
  const form = useForm<BondFormValues>({
    resolver: zodResolver(bondFormSchema),
    defaultValues: initial.values,
    mode: "onChange",
  });
  const [priceMode, setPriceMode] = useState<PriceMode>(initial.mode);
  const values = form.watch();
  const analytics = useBondAnalytics(values, priceMode);

  // Keep yield and clean price consistent (same rule as the calculator).
  useEffect(() => {
    if (!analytics.ok) return;
    if (priceMode === "yield") {
      const cp = round6(analytics.pricing.cleanPrice);
      if (round6(values.cleanPrice) !== cp) form.setValue("cleanPrice", cp, { shouldValidate: true });
    } else {
      const y = round6(analytics.yieldDecimal * 100);
      if (round6(values.yield) !== y) form.setValue("yield", y, { shouldValidate: true });
    }
  }, [analytics, priceMode, values.cleanPrice, values.yield, form]);

  // Persist to the shared store for cross-module use (e.g. Scenario Analysis).
  const signature = useMemo(() => JSON.stringify(values) + priceMode, [values, priceMode]);
  useEffect(() => {
    setBondValues(values);
    setBondMode(priceMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  const series = useMemo(() => {
    if (!analytics.ok) return null;
    const { bond, yieldDecimal, durations, pricing } = analytics;
    return {
      priceYield: buildPriceYieldSeries(bond, yieldDecimal),
      convexity: buildConvexitySeries(bond, yieldDecimal, durations.modified, pricing.cleanPrice, pricing.dirtyPrice),
      timeline: buildTimelineSeries(analytics),
      pv: buildPvSeries(analytics),
      duration: buildDurationSeries(analytics),
      discount: buildDiscountSeries(analytics),
      summary: buildCashFlowSummary(analytics),
      ytmPct: yieldDecimal * 100,
      cleanPrice: pricing.cleanPrice,
      macaulay: durations.macaulay,
    };
  }, [analytics]);

  const dirtyPriceDisplay = analytics.ok ? formatNumber(analytics.pricing.dirtyPrice, 4) : "";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cash Flow Viewer"
        description="Interactive cash-flow analytics and visualizations, live from the FinTerminal engine."
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
            <span>{analytics.error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <SectionCard title="Bond Inputs" description="Edit any field — the table and every chart update instantly.">
        <BondForm control={form.control} setPriceMode={setPriceMode} dirtyPriceDisplay={dirtyPriceDisplay} />
      </SectionCard>

      {analytics.ok && series ? (
        <>
          <CashFlowKpiBar summary={series.summary} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <PriceYieldChart data={series.priceYield} currentYieldPct={series.ytmPct} currentPrice={series.cleanPrice} />
            <ConvexityChart data={series.convexity} currentYieldPct={series.ytmPct} currentPrice={series.cleanPrice} />
            <TimelineChart data={series.timeline} />
            <PresentValueChart data={series.pv} />
            <DurationChart data={series.duration} macaulay={series.macaulay} />
            <DiscountFactorChart data={series.discount} />
          </div>

          <SectionCard title="Cash Flow Table" description="Sort, search, resize, hide columns, paginate and export.">
            <CashFlowTable data={analytics.cashFlows} />
          </SectionCard>
        </>
      ) : (
        <SectionCard>
          <EmptyState
            title="Awaiting valid inputs"
            description="Provide a consistent bond definition to generate cash flows and charts."
          />
        </SectionCard>
      )}
    </div>
  );
}
