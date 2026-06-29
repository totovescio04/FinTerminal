"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { formatCurrency } from "@/lib/utils/format";
import type { AggregatedCashFlow } from "./types";

interface PortfolioCashFlowsProps {
  rows: AggregatedCashFlow[];
  limit?: number;
}

/** Aggregated portfolio cash-flow schedule (engine cash flows summed by date). */
export function PortfolioCashFlows({ rows, limit = 16 }: PortfolioCashFlowsProps) {
  if (rows.length === 0) {
    return <EmptyState title="No cash flows" description="Add holdings to project aggregated cash flows." />;
  }
  const shown = rows.slice(0, limit);
  const totalCoupon = rows.reduce((s, r) => s + r.coupon, 0);
  const totalPrincipal = rows.reduce((s, r) => s + r.principal, 0);
  const totalPv = rows.reduce((s, r) => s + r.presentValue, 0);
  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total Coupon</TableHead>
              <TableHead className="text-right">Total Principal</TableHead>
              <TableHead className="text-right">Total Cash Flow</TableHead>
              <TableHead className="text-right">Present Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((r) => (
              <TableRow key={r.date}>
                <TableCell>{r.date}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCurrency(r.coupon)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCurrency(r.principal)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCurrency(r.total)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCurrency(r.presentValue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2 text-xs">
        <span className="text-muted-foreground">Showing {shown.length} of {rows.length} dates</span>
        <div className="flex gap-6 tabular-nums">
          <span>Coupons <b>{formatCurrency(totalCoupon)}</b></span>
          <span>Principal <b>{formatCurrency(totalPrincipal)}</b></span>
          <span>PV <b>{formatCurrency(totalPv)}</b></span>
        </div>
      </div>
    </div>
  );
}
