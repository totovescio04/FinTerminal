import type { Metadata } from "next";
import { PortfolioOptimizer } from "@/components/optimization";

export const metadata: Metadata = { title: "Portfolio Optimizer" };

/**
 * Portfolio Optimizer — thin server wrapper. Optimization math lives in
 * `@/lib/portfolio-optimization`; inputs derive from the existing engines.
 */
export default function OptimizerPage() {
  return <PortfolioOptimizer />;
}
