"use client";

import type { ColumnDef, RowData } from "@tanstack/react-table";
import type { CashFlow } from "@/lib/fixed-income";
import { CASH_FLOW_FIELDS, formatCashFlowCell } from "./cash-flow-fields";

// Strongly-typed column meta (avoids `any` for the numeric flag).
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    numeric?: boolean;
  }
}

/** TanStack column definitions generated from the shared field descriptors. */
export const cashFlowColumns: ColumnDef<CashFlow>[] = CASH_FLOW_FIELDS.map((field) => ({
  id: field.key,
  accessorKey: field.key,
  header: field.header,
  enableHiding: field.key !== "index",
  sortingFn: field.type === "date" ? "datetime" : "auto",
  cell: ({ row }) => formatCashFlowCell(row.original, field),
  meta: { numeric: field.numeric },
  size: field.key === "paymentDate" ? 130 : field.key === "accrualDays" ? 150 : 120,
}));
