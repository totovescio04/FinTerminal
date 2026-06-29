/**
 * @file stress.ts
 * Stress-scenario SHAPES only — the per-position basis-point shift for a given
 * tenor. The actual repricing is done by the scenario engine
 * (`computeScenario`) in the dashboard; this file never prices.
 */

export type StressType = "parallel" | "steepen" | "flatten" | "twist" | "butterfly";

export interface StressScenario {
  id: string;
  label: string;
  type: StressType;
  magnitudeBps: number;
  pivot?: number;
}

/** Predefined stress scenarios. */
export const STRESS_SCENARIOS: StressScenario[] = [
  { id: "ratesUp", label: "Rates +150 (sharp)", type: "parallel", magnitudeBps: 150 },
  { id: "ratesDown", label: "Rates −150 (sharp)", type: "parallel", magnitudeBps: -150 },
  { id: "steepener", label: "Steepener", type: "steepen", magnitudeBps: 50 },
  { id: "flattener", label: "Flattener", type: "flatten", magnitudeBps: 50 },
  { id: "twist", label: "Twist", type: "twist", magnitudeBps: 50 },
  { id: "butterfly", label: "Butterfly", type: "butterfly", magnitudeBps: 50 },
];

/**
 * Basis-point shift applied to a position at `remainingYears` under a scenario.
 *  - parallel : constant.
 *  - steepen / twist : rotation about the pivot (long up, short down).
 *  - flatten : inverse of steepen.
 *  - butterfly : belly down, wings up about the pivot.
 */
export function stressShiftBps(scenario: StressScenario, remainingYears: number): number {
  const t = remainingYears;
  const m = scenario.magnitudeBps;
  const pivot = scenario.pivot ?? 10;
  switch (scenario.type) {
    case "parallel":
      return m;
    case "steepen":
    case "twist":
      return (m * (t - pivot)) / 20;
    case "flatten":
      return (-m * (t - pivot)) / 20;
    case "butterfly":
      return m * (Math.abs(t - pivot) / pivot - 0.5);
  }
}
