import type { Metadata } from "next";
import { CashFlowViewer } from "@/components/cash-flow";

export const metadata: Metadata = { title: "Cash Flow Viewer" };

/**
 * Cash Flow Viewer module — thin server wrapper around the client
 * <CashFlowViewer/>, which consumes analytics exclusively from
 * `@/lib/fixed-income` via the shared bond store.
 */
export default function CashFlowsPage() {
  return <CashFlowViewer />;
}
