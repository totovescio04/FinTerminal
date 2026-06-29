"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import {
  addPosition,
  clearPortfolio,
  hydratePortfolio,
  removePosition,
  updatePosition,
  usePortfolio,
} from "./portfolio-store";
import { buildPortfolio, buildRiskHighlights } from "./portfolio-engine";
import { BLANK_POSITION } from "./constants";
import { EMPTY_FILTERS, type PortfolioFilterState, type Position } from "./types";
import { PortfolioToolbar } from "./portfolio-toolbar";
import { PortfolioFilters } from "./portfolio-filters";
import { PortfolioKPIs } from "./portfolio-kpis";
import { PortfolioSummary } from "./portfolio-summary";
import { PortfolioRisk } from "./portfolio-risk";
import { PortfolioTable } from "./portfolio-table";
import { PortfolioCharts } from "./portfolio-charts";
import { PortfolioCashFlows } from "./portfolio-cash-flows";
import { AddBondDialog } from "./add-bond-dialog";

type PositionDraft = Omit<Position, "id">;

/**
 * Portfolio Analytics — multi-bond book with live, engine-derived aggregates.
 *
 * Positions are the only persisted data (localStorage); every metric — market
 * value, weighted yield/duration/convexity, aggregate DV01, cash flows — is
 * recomputed from `@/lib/fixed-income` via `buildPortfolio`. No financial
 * formula is implemented in this module.
 */
export function PortfolioAnalytics() {
  const positions = usePortfolio();
  useEffect(() => hydratePortfolio(), []);

  const [filters, setFilters] = useState<PortfolioFilterState>(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const analytics = useMemo(() => buildPortfolio(positions, filters), [positions, filters]);
  const highlights = useMemo(() => buildRiskHighlights(analytics), [analytics]);

  const editing = editingId ? positions.find((p) => p.id === editingId) ?? null : null;
  const initialDraft: PositionDraft = editing
    ? {
        ticker: editing.ticker,
        bondName: editing.bondName,
        faceValue: editing.faceValue,
        quantity: editing.quantity,
        purchasePrice: editing.purchasePrice,
        yield: editing.yield,
        couponRate: editing.couponRate,
        issueDate: editing.issueDate,
        settlementDate: editing.settlementDate,
        maturityDate: editing.maturityDate,
        frequency: editing.frequency,
        dayCount: editing.dayCount,
        currency: editing.currency,
      }
    : BLANK_POSITION;

  const openAdd = () => {
    setEditingId(null);
    setDialogOpen(true);
  };
  const openEdit = (id: string) => {
    setEditingId(id);
    setDialogOpen(true);
  };
  const handleSubmit = (draft: PositionDraft) => {
    if (editingId) updatePosition(editingId, draft);
    else addPosition(draft);
  };
  const setFilter = <K extends keyof PortfolioFilterState>(key: K, value: PortfolioFilterState[K]) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const signature = `${analytics.numberOfBonds}:${analytics.marketValue.toFixed(2)}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio Analytics"
        description="Build a fixed-income book and analyse aggregate risk — live from the FinTerminal engine."
        actions={<Badge variant="muted">Auto-saved</Badge>}
      />

      <PortfolioToolbar
        search={filters.search}
        onSearch={(v) => setFilter("search", v)}
        onAdd={openAdd}
        onToggleFilters={() => setShowFilters((s) => !s)}
        onClear={clearPortfolio}
      />

      {showFilters && (
        <PortfolioFilters filters={filters} onChange={setFilter} onReset={() => setFilters(EMPTY_FILTERS)} />
      )}

      <motion.div key={signature} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <PortfolioKPIs data={analytics} />
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <PortfolioSummary data={analytics} />
        <div className="xl:col-span-2">
          <PortfolioRisk highlights={highlights} />
        </div>
      </div>

      <SectionCard title="Holdings" description="Sort, configure columns, edit or remove positions.">
        <PortfolioTable rows={analytics.positions} onEdit={openEdit} onDelete={removePosition} />
      </SectionCard>

      <PortfolioCharts data={analytics} />

      <SectionCard title="Aggregated Cash Flows" description="Every holding's engine cash flows, summed by date.">
        <PortfolioCashFlows rows={analytics.aggregatedCashFlows} />
      </SectionCard>

      <AddBondDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingId(null);
        }}
        title={editingId ? "Edit position" : "Add bond"}
        initial={initialDraft}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
