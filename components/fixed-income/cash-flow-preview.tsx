"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import type { BondAnalytics } from "./use-bond-analytics";
import { formatDate, num } from "./format";

interface CashFlowPreviewProps {
  analytics: BondAnalytics;
  /** Maximum rows to show in the preview. */
  limit?: number;
}

/**
 * A compact preview of the bond's discounted cash flows. Data comes directly
 * from the engine's generateCashFlows(); the full Cash Flow Viewer is a later
 * stage.
 */
export function CashFlowPreview({ analytics, limit = 6 }: CashFlowPreviewProps) {
  if (!analytics.ok) {
    return <EmptyState title="No cash flows" description="Provide valid bond inputs to preview cash flows." />;
  }
  const rows = analytics.cashFlows.slice(0, limit);
  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-10">#</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Coupon</TableHead>
              <TableHead className="text-right">Principal</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">DF</TableHead>
              <TableHead className="text-right">PV</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((cf) => (
              <TableRow key={cf.index}>
                <TableCell className="text-muted-foreground">{cf.index}</TableCell>
                <TableCell>{formatDate(cf.paymentDate)}</TableCell>
                <TableCell className="text-right tabular-nums">{num(cf.couponAmount)}</TableCell>
                <TableCell className="text-right tabular-nums">{num(cf.principalAmount)}</TableCell>
                <TableCell className="text-right tabular-nums">{num(cf.totalCashFlow)}</TableCell>
                <TableCell className="text-right tabular-nums">{num(cf.discountFactor, 6)}</TableCell>
                <TableCell className="text-right tabular-nums">{num(cf.presentValue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        Showing {rows.length} of {analytics.cashFlows.length} cash flows · values per {analytics.bond.faceValue} face.
      </p>
    </div>
  );
}
