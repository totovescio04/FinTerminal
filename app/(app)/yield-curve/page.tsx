import type { Metadata } from "next";
import { YieldCurveBuilder } from "@/components/yield-curve";

export const metadata: Metadata = { title: "Yield Curve" };

/**
 * Yield Curve module — thin server wrapper around the client builder, which
 * uses the engine in `@/lib/yield-curve` for all curve math.
 */
export default function YieldCurvePage() {
  return <YieldCurveBuilder />;
}
