"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSection, InputField, DateField, SelectField } from "@/components/fixed-income";
import { DAY_COUNT_OPTIONS, FREQUENCY_OPTIONS } from "@/components/fixed-income/options";
import { createBond, type DayCountConvention, type Frequency } from "@/lib/fixed-income";
import { CURRENCY_OPTIONS } from "./constants";
import type { Position } from "./types";

type PositionDraft = Omit<Position, "id">;

interface PositionEditorProps {
  initial: PositionDraft;
  onSubmit: (data: PositionDraft) => void;
  onCancel: () => void;
}

const numStr = (v: number) => (Number.isFinite(v) ? String(v) : "");

function validate(d: PositionDraft): string | null {
  if (!d.ticker.trim() || !d.bondName.trim()) return "Ticker and bond name are required.";
  if (!(d.faceValue > 0)) return "Face value must be positive.";
  if (!(d.quantity > 0)) return "Quantity must be positive.";
  if (!(d.purchasePrice > 0)) return "Purchase price must be positive.";
  if (!(d.yield > 0)) return "Yield must be positive.";
  if (d.couponRate < 0) return "Coupon cannot be negative.";
  try {
    createBond({
      faceValue: d.faceValue,
      couponRate: d.couponRate / 100,
      issueDate: new Date(d.issueDate),
      maturityDate: new Date(d.maturityDate),
      settlementDate: new Date(d.settlementDate),
      frequency: d.frequency,
      dayCount: d.dayCount,
    });
  } catch (e) {
    return e instanceof Error ? e.message : "Invalid bond dates.";
  }
  return null;
}

/** Reusable add/edit form for a single portfolio holding. */
export function PositionEditor({ initial, onSubmit, onCancel }: PositionEditorProps) {
  const [draft, setDraft] = useState<PositionDraft>(initial);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof PositionDraft>(key: K, value: PositionDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));
  const numField = (key: keyof PositionDraft) => (s: string) =>
    set(key, (s === "" ? NaN : Number(s)) as PositionDraft[typeof key]);

  const handleSubmit = () => {
    const message = validate(draft);
    if (message) {
      setError(message);
      return;
    }
    onSubmit(draft);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto px-1 py-2">
        {error && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <FormSection title="Identification">
          <InputField label="Ticker" value={draft.ticker} onChange={(v) => set("ticker", v)} />
          <InputField label="Bond Name" value={draft.bondName} onChange={(v) => set("bondName", v)} />
        </FormSection>

        <FormSection title="Holding">
          <InputField label="Face Value" numeric prefix="$" value={numStr(draft.faceValue)} onChange={numField("faceValue")} />
          <InputField label="Quantity" numeric value={numStr(draft.quantity)} onChange={numField("quantity")} />
          <InputField label="Purchase Price" numeric value={numStr(draft.purchasePrice)} onChange={numField("purchasePrice")} />
          <SelectField label="Currency" value={draft.currency} onChange={(v) => set("currency", v)} options={CURRENCY_OPTIONS} />
        </FormSection>

        <FormSection title="Terms">
          <InputField label="Coupon Rate" numeric suffix="%" step="0.001" value={numStr(draft.couponRate)} onChange={numField("couponRate")} />
          <InputField label="Yield" numeric suffix="%" step="0.001" value={numStr(draft.yield)} onChange={numField("yield")} />
          <SelectField label="Frequency" value={draft.frequency} onChange={(v) => set("frequency", v as Frequency)} options={FREQUENCY_OPTIONS} />
          <SelectField label="Day Count" value={draft.dayCount} onChange={(v) => set("dayCount", v as DayCountConvention)} options={DAY_COUNT_OPTIONS} />
        </FormSection>

        <FormSection title="Dates">
          <DateField label="Issue Date" value={draft.issueDate} onChange={(v) => set("issueDate", v)} />
          <DateField label="Settlement Date" value={draft.settlementDate} onChange={(v) => set("settlementDate", v)} />
          <DateField label="Maturity Date" value={draft.maturityDate} onChange={(v) => set("maturityDate", v)} />
        </FormSection>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save position</Button>
      </div>
    </div>
  );
}
