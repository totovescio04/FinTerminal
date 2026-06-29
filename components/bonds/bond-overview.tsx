"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils/format";
import type { BondRecord } from "@/lib/data/bond-model";

interface BondOverviewProps {
  record: BondRecord;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium tabular-nums">{value}</dd>
    </div>
  );
}

const FLAGS: { key: keyof BondRecord; label: string }[] = [
  { key: "callable", label: "Callable" },
  { key: "puttable", label: "Puttable" },
  { key: "fixedRate", label: "Fixed Rate" },
  { key: "floatingRate", label: "Floating" },
  { key: "zeroCoupon", label: "Zero Coupon" },
  { key: "inflationLinked", label: "Inflation Linked" },
];

/** Full instrument overview (general information) for the detail page. */
export function BondOverview({ record }: BondOverviewProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Ticker" value={record.ticker} />
          <Field label="ISIN" value={record.isin} />
          <Field label="CUSIP" value={record.cusip ?? "—"} />
          <Field label="Issuer" value={record.issuer} />
          <Field label="Country" value={record.country} />
          <Field label="Currency" value={record.currency} />
          <Field label="Coupon" value={`${formatNumber(record.coupon, 3)}% ${record.couponType}`} />
          <Field label="Frequency" value={record.frequency} />
          <Field label="Day Count" value={record.dayCount} />
          <Field label="Issue Date" value={record.issueDate} />
          <Field label="Maturity" value={record.maturityDate} />
          <Field label="Settlement" value={`T+${record.settlementDays}`} />
          <Field label="Face Value" value={formatNumber(record.faceValue, 0)} />
          <Field label="Amortization" value={record.amortizationType} />
          <Field label="Sector" value={record.sector} />
          <Field label="Market" value={record.market} />
          <Field label="Exchange" value={record.exchange} />
          <Field label="Rating" value={`${record.rating} (${record.ratingClass})`} />
        </dl>
        <div className="flex flex-wrap gap-2">
          {FLAGS.filter((f) => record[f.key] === true).map((f) => (
            <Badge key={f.label} variant="secondary">{f.label}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
