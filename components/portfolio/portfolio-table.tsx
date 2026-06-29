"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown, Pencil, SlidersHorizontal, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/shared/empty-state";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { PositionAnalytics } from "./types";

interface PortfolioTableProps {
  rows: PositionAnalytics[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const signedClass = (v: number) => (v > 0 ? "text-positive" : v < 0 ? "text-negative" : "");
const signedMoney = (v: number) => (v > 0 ? "+" : "") + formatCurrency(v);

/** Professional holdings table (TanStack): sortable, paginated, configurable. */
export function PortfolioTable({ rows, onEdit, onDelete }: PortfolioTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });

  const columns = useMemo<ColumnDef<PositionAnalytics>[]>(
    () => [
      { id: "ticker", header: "Ticker", accessorFn: (r) => r.position.ticker, cell: ({ row }) => <span className="font-medium">{row.original.position.ticker}</span> },
      { id: "name", header: "Name", accessorFn: (r) => r.position.bondName, cell: ({ row }) => <span className="text-muted-foreground">{row.original.position.bondName}</span> },
      { id: "quantity", header: "Quantity", accessorFn: (r) => r.position.quantity, cell: ({ row }) => formatNumber(row.original.position.quantity, 0) },
      { id: "marketValue", header: "Market Value", accessorFn: (r) => r.marketValue, cell: ({ row }) => formatCurrency(row.original.marketValue) },
      { id: "weight", header: "Weight", accessorFn: (r) => r.weight, cell: ({ row }) => formatPercent(row.original.weight * 100, 2) },
      { id: "coupon", header: "Coupon", accessorFn: (r) => r.position.couponRate, cell: ({ row }) => `${formatNumber(row.original.position.couponRate, 3)}%` },
      { id: "yield", header: "Yield", accessorFn: (r) => r.yieldDecimal, cell: ({ row }) => `${formatNumber(row.original.yieldDecimal * 100, 3)}%` },
      { id: "modified", header: "Mod Dur", accessorFn: (r) => r.modifiedDuration, cell: ({ row }) => formatNumber(row.original.modifiedDuration, 3) },
      { id: "convexity", header: "Convexity", accessorFn: (r) => r.convexity, cell: ({ row }) => formatNumber(row.original.convexity, 2) },
      { id: "dv01", header: "DV01", accessorFn: (r) => r.dv01, cell: ({ row }) => formatCurrency(row.original.dv01) },
      { id: "pvbp", header: "PVBP", accessorFn: (r) => r.pvbp, cell: ({ row }) => formatCurrency(row.original.pvbp) },
      { id: "currentYield", header: "Curr Yld", accessorFn: (r) => r.currentYield, cell: ({ row }) => `${formatNumber(row.original.currentYield, 3)}%` },
      { id: "pnl", header: "P&L", accessorFn: (r) => r.pnl, cell: ({ row }) => <span className={cn("tabular-nums", signedClass(row.original.pnl))}>{signedMoney(row.original.pnl)}</span> },
      { id: "returnPct", header: "Return %", accessorFn: (r) => r.returnPct, cell: ({ row }) => <span className={cn("tabular-nums", signedClass(row.original.returnPct))}>{(row.original.returnPct > 0 ? "+" : "") + formatNumber(row.original.returnPct, 2)}%</span> },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(row.original.position.id)} aria-label="Edit">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => onDelete(row.original.position.id)} aria-label="Delete">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete],
  );

  const table = useReactTable<PositionAnalytics>({
    data: rows,
    columns,
    state: { sorting, columnVisibility, pagination },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (rows.length === 0) {
    return <EmptyState title="No holdings" description="Add a bond or relax the filters to see positions." />;
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-72 w-48 overflow-y-auto">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table.getAllColumns().filter((c) => c.getCanHide()).map((column) => (
              <DropdownMenuCheckboxItem key={column.id} checked={column.getIsVisible()} onSelect={(e) => e.preventDefault()} onCheckedChange={(v) => column.toggleVisibility(Boolean(v))}>
                {String(column.columnDef.header) || column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-muted/40 hover:bg-muted/40">
                {hg.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button type="button" onClick={header.column.getToggleSortingHandler()} className="inline-flex items-center gap-1 hover:text-foreground">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === "asc" ? <ArrowUp className="h-3 w-3" /> : sorted === "desc" ? <ArrowDown className="h-3 w-3" /> : <ChevronsUpDown className="h-3 w-3 opacity-50" />}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="whitespace-nowrap tabular-nums">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{rows.length} holdings</p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-1 text-xs tabular-nums text-muted-foreground">
            {pagination.pageIndex + 1} / {Math.max(table.getPageCount(), 1)}
          </span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
