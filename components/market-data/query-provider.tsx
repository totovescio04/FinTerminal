"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Scoped TanStack Query provider for market-data views. Kept local (not in the
 * root layout) so no existing screen is modified — wrap any market-data UI with
 * this. Smart caching: results are reused within `staleTime`, no duplicate calls.
 */
export function MarketDataProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15_000,
            gcTime: 300_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
