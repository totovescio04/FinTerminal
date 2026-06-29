"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { MarketDataProvider } from "./query-provider";
import { MarketSnapshot } from "./market-snapshot";
import { ProviderStatus } from "./provider-status";
import { QuoteCard } from "./quote-card";
import { FXCard } from "./fx-card";
import { HistoricalChart } from "./historical-chart";

const QUOTE_SYMBOLS = ["AL30", "GD30", "T 4 34", "AAPL 30"];

/**
 * Market Data showcase. Wrapped in its own {@link MarketDataProvider} so no
 * existing screen/layout is touched. All data flows through the market-data
 * services (cache + provider fallback); components never call an API directly.
 */
export function MarketOverview() {
  return (
    <MarketDataProvider>
      <div className="space-y-6">
        <PageHeader
          title="Market Data"
          description="Live quotes, curves, FX and history through a multi-provider, cached data layer."
          actions={<Badge variant="muted">Local provider</Badge>}
        />

        <MarketSnapshot />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {QUOTE_SYMBOLS.map((s) => (
                <QuoteCard key={s} symbol={s} />
              ))}
            </div>
            <HistoricalChart symbol="GD30" field="price" range="3M" />
          </div>

          <div className="space-y-6">
            <ProviderStatus />
            <SectionCard title="FX">
              <div className="grid grid-cols-2 gap-3">
                <FXCard base="USD" quote="EUR" />
                <FXCard base="USD" quote="ARS" />
                <FXCard base="USD" quote="JPY" />
                <FXCard base="USD" quote="GBP" />
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </MarketDataProvider>
  );
}
