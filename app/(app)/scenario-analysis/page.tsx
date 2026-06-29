import type { Metadata } from "next";
import { ScenarioAnalysis } from "@/components/scenario";

export const metadata: Metadata = { title: "Scenario Analysis" };

/**
 * Scenario Analysis module — thin server wrapper around the client
 * <ScenarioAnalysis/>, which consumes the active bond from the shared store and
 * prices every scenario through `@/lib/fixed-income`.
 */
export default function ScenarioAnalysisPage() {
  return <ScenarioAnalysis />;
}
