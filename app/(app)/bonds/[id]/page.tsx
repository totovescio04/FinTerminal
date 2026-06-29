import type { Metadata } from "next";
import { BondDetails } from "@/components/bonds";

export const metadata: Metadata = { title: "Bond Details" };

/** Bond detail route. In Next 15 route params are async. */
export default async function BondDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BondDetails id={id} />;
}
