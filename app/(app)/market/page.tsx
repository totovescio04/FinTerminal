import type { Metadata } from "next";
import { MarketOverview } from "@/components/market-data";

export const metadata: Metadata = { title: "Market Data" };

/**
 * Market Data route. The page only composes UI; all fetching goes through the
 * independent market-data layer (`@/lib/market-data`).
 */
export default function MarketPage() {
  return <MarketOverview />;
}
