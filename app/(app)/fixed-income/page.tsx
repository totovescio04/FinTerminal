import type { Metadata } from "next";
import { BondCalculator } from "@/components/fixed-income";

export const metadata: Metadata = { title: "Bond Calculator" };

/**
 * Fixed Income module — Bond Calculator.
 * The page is a thin server wrapper; all interactivity lives in the client
 * <BondCalculator/>, which consumes analytics exclusively from
 * `@/lib/fixed-income`.
 */
export default function FixedIncomePage() {
  return <BondCalculator />;
}
