"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { LoadingState } from "@/components/shared/loading-state";
import { Badge } from "@/components/ui/badge";
import { EMPTY_FILTER_FORM, toCriteria, type FilterForm } from "./screener-types";
import { useBondFacets, useBondScreener } from "./use-bond-data";
import { addBondToPortfolio, loadBondIntoAnalysis } from "./bond-actions";
import { hydrateWatchlist, toggleWatch, useWatchlist } from "./watchlist-store";
import { hydrateRecent } from "./recent-store";
import { BondSearch } from "./bond-search";
import { BondFilters } from "./bond-filters";
import { BondTable } from "./bond-table";
import { RecentlyViewed } from "./recently-viewed";
import { BondWatchlist } from "./bond-watchlist";
import type { BondRecord } from "@/lib/data/bond-model";

/**
 * Bond Master Database + Screener. Components consume the {@link BondService}
 * only; selecting a bond loads it into the shared analysis store (Cash Flow
 * Viewer + Scenario Analysis auto-fill) and opens the detail page.
 */
export function BondScreener() {
  const [form, setForm] = useState<FilterForm>(EMPTY_FILTER_FORM);
  const [showFilters, setShowFilters] = useState(false);
  const facets = useBondFacets();
  const router = useRouter();

  useEffect(() => {
    hydrateWatchlist();
    hydrateRecent();
  }, []);

  const criteria = useMemo(() => toCriteria(form), [form]);
  const { results, loading } = useBondScreener(criteria);
  const watched = useWatchlist();

  const setField = <K extends keyof FilterForm>(key: K, value: FilterForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const openDetail = (record: BondRecord) => {
    loadBondIntoAnalysis(record);
    router.push(`/bonds/${record.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bond Database"
        description="Search and screen the bond universe — selecting a bond fills the Calculator, Cash Flows and Scenarios."
        actions={<Badge variant="muted">{results.length} instruments</Badge>}
      />

      <BondSearch search={form.search} onSearch={(v) => setField("search", v)} onToggleFilters={() => setShowFilters((s) => !s)} resultCount={results.length} />

      {showFilters && <BondFilters form={form} onChange={setField} facets={facets} onReset={() => setForm(EMPTY_FILTER_FORM)} />}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionCard title="Results" description="Click a row to open details and load the bond into analysis.">
            {loading && results.length === 0 ? (
              <LoadingState rows={6} />
            ) : (
              <BondTable results={results} watchedIds={watched} onRowClick={openDetail} onToggleWatch={toggleWatch} onAdd={addBondToPortfolio} />
            )}
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Recently Viewed">
            <RecentlyViewed onSelect={openDetail} onAdd={addBondToPortfolio} />
          </SectionCard>
          <SectionCard title="Watchlist">
            <BondWatchlist onSelect={openDetail} onAdd={addBondToPortfolio} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
