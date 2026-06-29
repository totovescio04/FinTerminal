"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldLabel } from "./field-label";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  numeric?: boolean;
  step?: string;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  error?: string;
  tooltip?: string;
  readOnly?: boolean;
}

/**
 * Reusable, controlled text/number field. Emits raw string values; callers
 * convert to numbers (so empty -> NaN is validated by Zod rather than coerced).
 */
export function InputField({
  label,
  value,
  onChange,
  onFocus,
  numeric = false,
  step,
  prefix,
  suffix,
  placeholder,
  error,
  tooltip,
  readOnly = false,
}: InputFieldProps) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id} label={label} tooltip={tooltip} />
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          id={id}
          type={numeric ? "number" : "text"}
          inputMode={numeric ? "decimal" : undefined}
          step={step}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          onFocus={onFocus}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className={cn(
            prefix && "pl-7",
            suffix && "pr-9",
            readOnly && "bg-muted/50 text-muted-foreground",
            error && "border-destructive focus-visible:ring-destructive",
          )}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
