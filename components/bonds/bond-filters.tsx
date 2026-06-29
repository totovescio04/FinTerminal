"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/fixed-income";
import type { Option } from "@/components/fixed-income/options";
import type { FilterForm } from "./screener-types";

interface BondFiltersProps {
  form: FilterForm;
  onChange: <K extends keyof FilterForm>(key: K, value: FilterForm[K]) => void;
  facets: { countries: string[]; currencies: string[]; sectors: string[] };
  onReset: () => void;
}

const opt = (values: string[], allLabel: string): Option<string>[] => [
  { label: allLabel, value: "all" },
  ...values.map((v) => ({ label: v, value: v })),
];

const RATING_OPTIONS: Option<string>[] = [
  { label: "All ratings", value: "all" },
  { label: "Investment Grade", value: "IG" },
  { label: "High Yield", value: "HY" },
];

function Range({ label, minKey, maxKey, form, onChange }: {
  label: string;
  minKey: keyof FilterForm;
  maxKey: keyof FilterForm;
  form: FilterForm;
  onChange: BondFiltersProps["onChange"];
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input type="number" placeholder="min" value={String(form[minKey])} onChange={(e) => onChange(minKey, e.target.value as FilterForm[typeof minKey])} className="h-8" />
        <Input type="number" placeholder="max" value={String(form[maxKey])} onChange={(e) => onChange(maxKey, e.target.value as FilterForm[typeof maxKey])} className="h-8" />
      </div>
    </div>
  );
}

/** Screener filter panel: country, currency, sector, rating class and ranges. */
export function BondFilters({ form, onChange, facets, onReset }: BondFiltersProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-card">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SelectField label="Country" value={form.country || "all"} onChange={(v) => onChange("country", v === "all" ? "" : v)} options={opt(facets.countries, "All countries")} />
        <SelectField label="Currency" value={form.currency || "all"} onChange={(v) => onChange("currency", v === "all" ? "" : v)} options={opt(facets.currencies, "All currencies")} />
        <SelectField label="Sector" value={form.sector || "all"} onChange={(v) => onChange("sector", v === "all" ? "" : v)} options={opt(facets.sectors, "All sectors")} />
        <SelectField label="Rating" value={form.ratingClass} onChange={(v) => onChange("ratingClass", v as FilterForm["ratingClass"])} options={RATING_OPTIONS} />
        <div className="space-y-1.5">
          <Label>Issuer</Label>
          <Input value={form.issuer} onChange={(e) => onChange("issuer", e.target.value)} placeholder="e.g. Treasury" className="h-8" />
        </div>
        <Range label="Coupon (%)" minKey="couponMin" maxKey="couponMax" form={form} onChange={onChange} />
        <Range label="Yield (%)" minKey="yieldMin" maxKey="yieldMax" form={form} onChange={onChange} />
        <Range label="Mod. Duration" minKey="durationMin" maxKey="durationMax" form={form} onChange={onChange} />
        <Range label="Maturity Year" minKey="maturityFrom" maxKey="maturityTo" form={form} onChange={onChange} />
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="ghost" size="sm" onClick={onReset}>Reset filters</Button>
      </div>
    </div>
  );
}
