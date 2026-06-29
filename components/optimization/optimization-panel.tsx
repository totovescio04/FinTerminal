"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/fixed-income";
import type { Option } from "@/components/fixed-income/options";
import type { Constraints, Objective } from "@/lib/portfolio-optimization";

const OBJECTIVES: Option<Objective>[] = [
  { label: "Minimum Variance", value: "minVariance" },
  { label: "Maximum Sharpe", value: "maxSharpe" },
  { label: "Target Return", value: "targetReturn" },
  { label: "Target Risk", value: "targetRisk" },
  { label: "Maximum Diversification", value: "maxDiversification" },
  { label: "Risk Parity", value: "riskParity" },
];

interface OptimizationPanelProps {
  objective: Objective;
  constraints: Constraints;
  targetReturn: number;
  targetRisk: number;
  riskFree: number;
  onObjective: (o: Objective) => void;
  onConstraints: (patch: Partial<Constraints>) => void;
  onTargetReturn: (v: number) => void;
  onTargetRisk: (v: number) => void;
  onRiskFree: (v: number) => void;
}

function PctField({ label, value, onChange, step = "0.1" }: { label: string; value: number; onChange: (v: number) => void; step?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="relative">
        <Input type="number" step={step} value={String(value)} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} className="h-8 pr-6 tabular-nums" />
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
      </div>
    </div>
  );
}

/** Optimizer controls: objective, constraints and targets. */
export function OptimizationPanel(props: OptimizationPanelProps) {
  const { objective, constraints, onConstraints } = props;
  return (
    <div className="space-y-4">
      <SelectField label="Objective" value={objective} onChange={props.onObjective} options={OBJECTIVES} />

      <div className="grid grid-cols-2 gap-3">
        <PctField label="Min Weight" value={constraints.minWeight * 100} onChange={(v) => onConstraints({ minWeight: v / 100 })} />
        <PctField label="Max Weight" value={constraints.maxWeight * 100} onChange={(v) => onConstraints({ maxWeight: v / 100 })} />
        <PctField label="Cash" value={constraints.cash * 100} onChange={(v) => onConstraints({ cash: v / 100 })} />
        <div className="space-y-1.5">
          <Label className="text-xs">Max Assets</Label>
          <Input type="number" min="0" value={constraints.maxAssets ?? ""} onChange={(e) => onConstraints({ maxAssets: e.target.value === "" ? undefined : Number(e.target.value) })} className="h-8 tabular-nums" placeholder="all" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Short Selling</Label>
        <div className="flex gap-1">
          <Button size="sm" variant={!constraints.allowShort ? "default" : "outline"} onClick={() => onConstraints({ allowShort: false })}>No Short</Button>
          <Button size="sm" variant={constraints.allowShort ? "default" : "outline"} onClick={() => onConstraints({ allowShort: true })}>Allow Short</Button>
        </div>
      </div>

      {objective === "targetReturn" && <PctField label="Target Return" value={props.targetReturn * 100} onChange={(v) => props.onTargetReturn(v / 100)} step="0.05" />}
      {objective === "targetRisk" && <PctField label="Target Risk (vol)" value={props.targetRisk * 100} onChange={(v) => props.onTargetRisk(v / 100)} step="0.05" />}
      <PctField label="Risk-Free Rate" value={props.riskFree * 100} onChange={(v) => props.onRiskFree(v / 100)} step="0.05" />
    </div>
  );
}
