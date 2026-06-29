import type { Metadata } from "next";
import { BondScreener } from "@/components/bonds";

export const metadata: Metadata = { title: "Bond Database" };

/**
 * Bond Master Database + Screener. Data flows through the repository/service
 * layer (`@/lib/services/bond-service`); components never read the JSON directly.
 */
export default function BondsPage() {
  return <BondScreener />;
}
