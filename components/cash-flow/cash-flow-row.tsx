"use client";

import { flexRender, type Row } from "@tanstack/react-table";
import type { CashFlow } from "@/lib/fixed-income";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface CashFlowRowProps {
  row: Row<CashFlow>;
}

/** Renders a single cash-flow table row (numeric cells right-aligned). */
export function CashFlowRow({ row }: CashFlowRowProps) {
  return (
    <TableRow>
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          style={{ width: cell.column.getSize() }}
          className={cn("tabular-nums", cell.column.columnDef.meta?.numeric && "text-right")}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
