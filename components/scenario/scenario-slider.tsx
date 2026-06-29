"use client";

import { bp } from "./format";

interface ScenarioSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

/** Continuous parallel-shift slider (native range input, no extra deps). */
export function ScenarioSlider({ value, onChange, min = -200, max = 200, step = 5 }: ScenarioSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{bp(min)}</span>
        <span className="font-semibold tabular-nums text-foreground">{bp(value)}</span>
        <span>{bp(max)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Parallel shift (basis points)"
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
      />
    </div>
  );
}
