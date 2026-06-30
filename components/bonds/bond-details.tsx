"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, Check, FlaskConical, LineChart, Star } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";
import { MetricCard, useBondAnalytics, DEFAULT_BOND_FORM } from "@/components/fixed-income";
import { CashFlowViewer, PriceYieldChart } from "@/components/cash-flow";
import { buildPriceYieldSeries } from "@/components/cash-flow/analytics-series";
import { ScenarioTable, computeScenarioSet, type ScenarioBase } from "@/components/scenario";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { useBondRecord } from "./use-bond-data";
import { addBondToPortfolio, loadBondIntoAnalysis, recordToForm } from "./bond-actions";
import { pushRecent } from "./recent-store";
import { toggleWatch, useWatchlist } from "./watchlist-store";
import { BondOverview } from "./bond-overview";
import { IssuerCard } from "./issuer-card";
import { RatingBadge } from "./rating-badge";
interface BondDetailsProps {
  id: string;
}

/** Full bond detail page: overview, pricing, risk, cash flows, charts, scenarios. */
export function BondDetails({ id }: BondDetailsProps) {
  const { record, loading } = useBondRecord(id);
  const router = useRouter();
  const watched = useWatchlist();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (record) pushRecent(record.id);
  }, [record]);

  const form = record ? recordToForm(record) : DEFAULT_BOND_FORM;
  const analytics = useBondAnalytics(form, "yield");

  const curve = useMemo(
    () => (analytics.ok ? buildPriceYieldSeries(analytics.bond, analytics.yieldDecimal) : []),
    [analytics],
  );
  const scenarios = useMemo(() => {
    if (!analytics.ok) return [];
    const base: ScenarioBase = {
      bond: analytics.bond,
      ytm: analytics.yieldDecimal,
      clean0: analytics.pricing.cleanPrice,
      dirty0: analytics.pricing.dirtyPrice,
      modified: analytics.durations.modified,
      convexity: analytics.risk.convexity,
      face: analytics.bond.faceValue,
    };
    return computeScenarioSet(base, [-100, -50, 0, 50, 100]);
  }, [analytics]);

  if (loading) return <LoadingState rows={6} />;
  if (!record) {
    return (
      <EmptyState
        title="Bond not found"
        description="This instrument is not in the database."
        action={<Button asChild variant="outline"><Link href="/bonds"><ArrowLeft className="h-4 w-4" />Back to database</Link></Button>}
      />
    );
  }

  const openIn = (path: string) => {
    loadBondIntoAnalysis(record);
    router.push(path);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/bonds" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Bond Database
        </Link>
        <PageHeader
          title={record.ticker}
          description={record.name}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <RatingBadge rating={record.rating} />
              <Button variant="outline" size="sm" onClick={() => toggleWatch(record.id)}>
                <Star className={cn("h-4 w-4", watched.includes(record.id) && "fill-amber-400 text-amber-400")} />
                Watch
              </Button>
              <Button variant="outline" size="sm" onClick={() => { addBondToPortfolio(record); setAdded(true); }}>
                {added ? <Check className="h-4 w-4" /> : <BriefcaseBusiness className="h-4 w-4" />}
                {added ? "Added" : "Add to Portfolio"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => openIn("/cash-flows")}>
                <LineChart className="h-4 w-4" /> Cash Flows
              </Button>
              <Button size="sm" onClick={() => openIn("/scenario-analysis")}>
                <FlaskConical className="h-4 w-4" /> Scenarios
              </Button>
            </div>
          }
        />
      </div>

      {analytics.ok && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
          <MetricCard label="Clean Price" value={formatNumber(analytics.pricing.cleanPrice, 4)} emphasis />
          <MetricCard label="Dirty Price" value={formatNumber(analytics.pricing.dirtyPrice, 4)} />
          <MetricCard label="Accrued" value={formatNumber(analytics.pricing.accruedInterest, 4)} />
          <MetricCard label="YTM" value={`${formatNumber(analytics.yieldDecimal * 100, 3)}%`} />
          <MetricCard label="Mod Duration" value={`${formatNumber(analytics.durations.modified, 3)}y`} />
          <MetricCard label="Convexity" value={formatNumber(analytics.risk.convexity, 2)} />
          <MetricCard label="DV01" value={formatCurrency(analytics.risk.dv01)} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <BondOverview record={record} />
        </div>
        <IssuerCard record={record} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard title="Cash Flows" description="Projected, discounted cash flows from the engine.">
          <CashFlowViewer />
        </SectionCard>
        {analytics.ok && (
          <PriceYieldChart data={curve} currentYieldPct={analytics.yieldDecimal * 100} currentPrice={analytics.pricing.cleanPrice} />
        )}
      </div>

      <SectionCard title="Scenario Analysis" description="Parallel rate shocks priced through the engine.">
        <ScenarioTable scenarios={scenarios} selectedShift={0} />
      </SectionCard>
    </div>
  );
}
