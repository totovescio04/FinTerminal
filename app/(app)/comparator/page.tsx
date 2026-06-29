import type { Metadata } from "next";
import { BondComparator } from "@/components/comparator";

export const metadata: Metadata = { title: "Bond Comparator" };

/**
 * Bond Comparator module — thin server wrapper around the client comparator,
 * which derives every metric from the existing engines (no math here).
 */
export default function ComparatorPage() {
  return <BondComparator />;
}
