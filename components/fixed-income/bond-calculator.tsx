"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { ChartCard } from "@/components/charts/chart-card";
import { ChartPlaceholder } from "@/components/charts/chart-placeholder";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, BarChart3, FlaskConical, PieChart } from "lucide-react";
import { bondFormSchema, DEFAULT_BOND_FORM, type BondFormValues, type PriceMode } from "./schema";
import { useBondAnalytics } from "./use-bond-analytics";
import { BondForm } from "./bond-form";
import { BondMetrics } from "./bond-metrics";
import { BondSummary } from "./bond-summary";
import { CashFlowViewer } from "@/components/cash-flow";
import { num } from "./format";

const round6 = (n: number) => Math.round(n * 1e6) / 1e6;

/**
 * Bond Calculator — the first functional FinTerminal module.
 *
 * Data flow (no "Calculate" button — everything is live):
 *   user edits a field
 *     -> React Hook Form updates `values`
 *     -> useBondAnalytics(values, mode) calls the fixed-income engine
 *     -> metrics, summary and cash flows re-render
 *     -> the non-driver price field (yield/clean price) is mirrored back
 *
 * All financial math is imported from `@/lib/fixed-income`; this component does
 * no pricing/yield/duration/convexity arithmetic of its own.
 */
export function BondCalculator() {
  const form = useForm<BondFormValues>({
    resolver: zodResolver(bondFormSchema),
    defaultValues: DEFAULT_BOND_FORM,
    mode: "onChange",
  });

  const [priceMode, setPriceMode] = useState<PriceMode>("yield");
  const values = form.watch();
  const analytics = useBondAnalytics(values, priceMode);

  // Mirror the engine's solved counterpart back into the non-driver field so
  // yield and clean price always stay mutually consistent.
  useEffect(() => {
    if (!analytics.ok) return;
    if (priceMode === "yield") {
      const cp = round6(analytics.pricing.cleanPrice);
      if (round6(values.cleanPrice) !== cp) {
        form.setValue("cleanPrice", cp, { shouldValidate: true, shouldDirty: false });
      }
    } else {
      const y = round6(analytics.yieldDecimal * 100);
      if (round6(values.yield) !== y) {
        form.setValue("yield", y, { shouldValidate: true, shouldDirty: false });
      }
    }
  }, [analytics, priceMode, values.cleanPrice, values.yield, form]);

  // Subtle loading state on each recalculation.
  const signature = useMemo(
    () =>
      [
        values.faceValue,
        values.couponRate,
        values.frequency,
        values.issueDate,
        values.settlementDate,
        values.maturityDate,
        values.dayCount,
        priceMode === "yield" ? values.yield : values.cleanPrice,
        priceMode,
      ].join("|"),
    [values, priceMode],
  );
  const [pending, setPending] = useState(false);
  useEffect(() => {
    setPending(true);
    const t = setTimeout(() => setPending(false), 160);
    return () => clearTimeout(t);
  }, [signature]);

  const dirtyPriceDisplay = analytics.ok ? num(analytics.pricing.dirtyPrice) : "";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bond Calculator"
        description="Real-time fixed-income pricing and risk, powered by the FinTerminal engine."
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

      {/* Three zones: form (left) · metrics (center) · summary (right) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <SectionCard title="Inputs" description="Edit any field to recalculate instantly.">
            <BondForm
              control={form.control}
              setPriceMode={setPriceMode}
              dirtyPriceDisplay={dirtyPriceDisplay}
            />
          </SectionCard>
        </div>

        <motion.div layout className="xl:col-span-5">
          <BondMetrics analytics={analytics} loading={pending && analytics.ok} />
        </motion.div>

        <div className="xl:col-span-3">
          <BondSummary values={values} analytics={analytics} />
        </div>
      </div>

      {/* Lower zone: cash flow preview (live) + reserved panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Cash Flow Preview" description="From the engine's projected cash flows">
          <CashFlowViewer />
        </SectionCard>

        <ChartCard title="Charts" description="Price / yield visualizations" action={<Badge variant="muted">Reserved</Badge>}>
          <ChartPlaceholder icon={BarChart3} height={220} label="Charts — next stage" />
        </ChartCard>

        <ChartCard title="Scenario Preview" description="Rate shock impact" action={<Badge variant="muted">Reserved</Badge>}>
          <ChartPlaceholder icon={FlaskConical} height={220} label="Scenario analysis — next stage" />
        </ChartCard>

        <ChartCard title="Portfolio Impact" description="Contribution to portfolio risk" action={<Badge variant="muted">Reserved</Badge>}>
          <ChartPlaceholder icon={PieChart} height={220} label="Portfolio impact — next stage" />
        </ChartCard>
      </div>
    </div>
  );
}
