import type { Metadata } from "next";
import { PortfolioAnalytics } from "@/components/portfolio";

export const metadata: Metadata = { title: "Portfolio Analytics" };

/**
 * Portfolio Analytics module — thin server wrapper around the client
 * <PortfolioAnalytics/>, which derives every aggregate from `@/lib/fixed-income`.
 */
export default function PortfolioPage() {
  return <PortfolioAnalytics />;
}
