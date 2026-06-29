"use client";

import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Option } from "./options";
import { FieldLabel } from "./field-label";

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  error?: string;
  tooltip?: string;
}

/** Reusable, controlled select built on the Radix Select primitive. */
export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  error,
  tooltip,
}: SelectFieldProps<T>) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id} label={label} tooltip={tooltip} />
      <Select value={value} onValueChange={(v) => onChange(v as T)}>
        <SelectTrigger id={id} aria-invalid={Boolean(error)}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
