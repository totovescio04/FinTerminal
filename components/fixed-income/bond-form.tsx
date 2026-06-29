"use client";

import { Controller, type Control } from "react-hook-form";
import { InputField } from "./input-field";
import { DateField } from "./date-field";
import { SelectField } from "./select-field";
import { FormSection } from "./form-section";
import { DAY_COUNT_OPTIONS, FREQUENCY_OPTIONS } from "./options";
import type { BondFormValues, PriceMode } from "./schema";

interface BondFormProps {
  control: Control<BondFormValues>;
  /** Switch the authoritative input (yield vs. clean price). */
  setPriceMode: (mode: PriceMode) => void;
  /** Read-only dirty price string (always derived from the engine). */
  dirtyPriceDisplay: string;
}

/** Number-field value helper: show "" for NaN so inputs can be cleared. */
const numStr = (value: number) => (Number.isFinite(value) ? String(value) : "");

/**
 * Left column: the bond definition + pricing inputs. Every field is controlled
 * by React Hook Form; there is no submit button — changes propagate live.
 */
export function BondForm({ control, setPriceMode, dirtyPriceDisplay }: BondFormProps) {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <FormSection title="Identification">
        <Controller
          control={control}
          name="bondName"
          render={({ field, fieldState }) => (
            <InputField label="Bond Name" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
        <Controller
          control={control}
          name="ticker"
          render={({ field, fieldState }) => (
            <InputField label="Ticker" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
      </FormSection>

      <FormSection title="Terms">
        <Controller
          control={control}
          name="faceValue"
          render={({ field, fieldState }) => (
            <InputField
              label="Face Value"
              numeric
              prefix="$"
              value={numStr(field.value)}
              onChange={(s) => field.onChange(s === "" ? NaN : Number(s))}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="couponRate"
          render={({ field, fieldState }) => (
            <InputField
              label="Coupon Rate"
              numeric
              suffix="%"
              step="0.001"
              value={numStr(field.value)}
              onChange={(s) => field.onChange(s === "" ? NaN : Number(s))}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="frequency"
          render={({ field, fieldState }) => (
            <SelectField
              label="Coupon Frequency"
              value={field.value}
              onChange={field.onChange}
              options={FREQUENCY_OPTIONS}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="dayCount"
          render={({ field, fieldState }) => (
            <SelectField
              label="Day Count Convention"
              value={field.value}
              onChange={field.onChange}
              options={DAY_COUNT_OPTIONS}
              error={fieldState.error?.message}
            />
          )}
        />
      </FormSection>

      <FormSection title="Dates">
        <Controller
          control={control}
          name="issueDate"
          render={({ field, fieldState }) => (
            <DateField label="Issue Date" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
        <Controller
          control={control}
          name="settlementDate"
          render={({ field, fieldState }) => (
            <DateField label="Settlement Date" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
        <Controller
          control={control}
          name="maturityDate"
          render={({ field, fieldState }) => (
            <DateField label="Maturity Date" value={field.value} onChange={field.onChange} error={fieldState.error?.message} />
          )}
        />
      </FormSection>

      <FormSection
        title="Pricing"
        description="Enter a yield or a clean price — the other is solved automatically."
      >
        <Controller
          control={control}
          name="yield"
          render={({ field, fieldState }) => (
            <InputField
              label="Yield"
              numeric
              suffix="%"
              step="0.001"
              tooltip="Editing yield re-prices the bond."
              value={numStr(field.value)}
              onFocus={() => setPriceMode("yield")}
              onChange={(s) => field.onChange(s === "" ? NaN : Number(s))}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="cleanPrice"
          render={({ field, fieldState }) => (
            <InputField
              label="Clean Price"
              numeric
              step="0.001"
              tooltip="Editing clean price solves the yield."
              value={numStr(field.value)}
              onFocus={() => setPriceMode("price")}
              onChange={(s) => field.onChange(s === "" ? NaN : Number(s))}
              error={fieldState.error?.message}
            />
          )}
        />
        <InputField
          label="Dirty Price"
          numeric
          readOnly
          tooltip="Clean price + accrued interest (derived)."
          value={dirtyPriceDisplay}
          onChange={() => undefined}
        />
      </FormSection>
    </form>
  );
}
