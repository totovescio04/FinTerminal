"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldLabel } from "./field-label";

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  tooltip?: string;
}

/** Controlled date field built on a native date input (no extra deps). */
export function DateField({ label, value, onChange, error, tooltip }: DateFieldProps) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id} label={label} tooltip={tooltip} />
      <Input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        className={cn(error && "border-destructive focus-visible:ring-destructive")}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
