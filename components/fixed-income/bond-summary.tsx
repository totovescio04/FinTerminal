"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { BondFormValues } from "./schema";
import type { BondAnalytics } from "./use-bond-analytics";
import { formatDate, money, num, pct } from "./format";

interface BondSummaryProps {
  values: BondFormValues;
  analytics: BondAnalytics;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}

/** Right column: a compact, at-a-glance summary of the active bond. */
export function BondSummary({ values, analytics }: BondSummaryProps) {
  const a = analytics.ok ? analytics : null;
  const toDate = (s: string) => (s ? new Date(s) : undefined);
  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Bond Summary</CardTitle>
        <Badge variant="secondary">{values.ticker || "—"}</Badge>
      </CardHeader>
      <CardContent>
        <p className="mb-2 truncate text-sm font-medium">{values.bondName || "Untitled bond"}</p>
        <Separator className="my-2" />
        <dl className="divide-y divide-border">
          <Row label="Coupon" value={pct(values.couponRate, 3)} />
          <Row label="Yield" value={a ? pct(a.yieldDecimal * 100) : "—"} />
          <Row label="Clean Price" value={num(a?.pricing.cleanPrice)} />
          <Row label="Frequency" value={values.frequency} />
          <Row label="Issue Date" value={formatDate(toDate(values.issueDate))} />
          <Row label="Settlement" value={formatDate(toDate(values.settlementDate))} />
          <Row label="Maturity" value={formatDate(toDate(values.maturityDate))} />
          <Row label="Remaining Coupons" value={a ? String(a.remainingCoupons) : "—"} />
          <Row label="Face Value" value={money(values.faceValue)} />
          <Row label="Market Value" value={money(a?.marketValue)} />
        </dl>
      </CardContent>
    </Card>
  );
}
