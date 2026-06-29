"use client";

import { SelectField } from "@/components/fixed-income";
import type { Option } from "@/components/fixed-income/options";
import type { InterpolationMethod } from "@/lib/yield-curve";

const OPTIONS: Option<InterpolationMethod>[] = [
  { label: "Linear", value: "linear" },
  { label: "Log-Linear", value: "logLinear" },
  { label: "Cubic Spline", value: "cubic" },
  { label: "Flat Forward", value: "flatForward" },
];

interface InterpolationSelectorProps {
  value: InterpolationMethod;
  onChange: (value: InterpolationMethod) => void;
}

/** Interpolation method picker. */
export function InterpolationSelector({ value, onChange }: InterpolationSelectorProps) {
  return <SelectField label="Interpolation" value={value} onChange={onChange} options={OPTIONS} />;
}
