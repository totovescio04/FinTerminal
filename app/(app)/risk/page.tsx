import type { Metadata } from "next";
import { RiskDashboard } from "@/components/risk";

export const metadata: Metadata = { title: "Risk Dashboard" };

/**
 * Risk Dashboard — thin server wrapper. All risk math is derived from the
 * existing engines (financial engine, scenario engine) + the pure `@/lib/risk`.
 */
export default function RiskPage() {
  return <RiskDashboard />;
}
