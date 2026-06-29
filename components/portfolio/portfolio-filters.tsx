"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/fixed-income";
import { CURRENCY_OPTIONS } from "./constants";
import type { PortfolioFilterState } from "./types";

interface PortfolioFiltersProps {
  filters: PortfolioFilterState;
  onChange: <K extends keyof PortfolioFilterState>(key: K, value: PortfolioFilterState[K]) => void;
  onReset: () => void;
}

const CURRENCY_FILTER = [{ label: "All currencies", value: "all" }, ...CURRENCY_OPTIONS];

function Range({
  label,
  minKey,
  maxKey,
  filters,
  onChange,
}: {
  label: string;
  minKey: keyof PortfolioFilterState;
  maxKey: keyof PortfolioFilterState;
  filters: PortfolioFilterState;
  onChange: PortfolioFiltersProps["onChange"];
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input type="number" placeholder="min" value={filters[minKey]} onChange={(e) => onChange(minKey, e.target.value)} className="h-8" />
        <Input type="number" placeholder="max" value={filters[maxKey]} onChange={(e) => onChange(maxKey, e.target.value)} className="h-8" />
      </div>
    </div>
  );
}

/** Filter panel: currency, yield, duration, coupon and maturity-year ranges. */
export function PortfolioFilters({ filters, onChange, onReset }: PortfolioFiltersProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-card">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SelectField
          label="Currency"
          value={filters.currency || "all"}
          onChange={(v) => onChange("currency", v === "all" ? "" : v)}
          options={CURRENCY_FILTER}
        />
        <Range label="Yield (%)" minKey="yieldMin" maxKey="yieldMax" filters={filters} onChange={onChange} />
        <Range label="Modified Duration" minKey="durationMin" maxKey="durationMax" filters={filters} onChange={onChange} />
        <Range label="Coupon (%)" minKey="couponMin" maxKey="couponMax" filters={filters} onChange={onChange} />
        <Range label="Maturity Year" minKey="maturityFromYear" maxKey="maturityToYear" filters={filters} onChange={onChange} />
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </div>
  );
}
