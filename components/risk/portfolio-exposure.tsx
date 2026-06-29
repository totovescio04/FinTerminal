"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils/format";
import {
  exposureByCountry,
  exposureByCurrency,
  exposureByRating,
  exposureBySector,
  maturityBuckets,
  type ExposureSlice,
  type RiskPosition,
} from "@/lib/risk";

function ExposureList({ title, slices }: { title: string; slices: ExposureSlice[] }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      <ul className="space-y-2">
        {slices.slice(0, 6).map((s) => (
          <li key={s.key} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="truncate">{s.key}</span>
              <span className="tabular-nums text-muted-foreground">{formatPercent(s.weight * 100, 1)}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${s.weight * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Exposure breakdowns + maturity buckets. */
export function PortfolioExposure({ positions }: { positions: RiskPosition[] }) {
  const buckets = maturityBuckets(positions);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3"><CardTitle>Exposure</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ExposureList title="By Currency" slices={exposureByCurrency(positions)} />
          <ExposureList title="By Sector" slices={exposureBySector(positions)} />
          <ExposureList title="By Rating" slices={exposureByRating(positions)} />
          <ExposureList title="By Country" slices={exposureByCountry(positions)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle>Maturity Buckets</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Bucket</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Weight</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buckets.map((b) => (
                  <TableRow key={b.label}>
                    <TableCell className="font-medium">{b.label}</TableCell>
                    <TableCell className="text-right tabular-nums">{b.count}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(b.value)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatPercent(b.weight * 100, 1)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatNumber(b.duration, 2)}y</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
