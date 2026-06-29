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
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown, Plus, Star } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import { RatingBadge } from "./rating-badge";
import type { BondRecord } from "@/lib/data/bond-model";
import type { BondScreenResult } from "@/lib/services/bond-service";

interface BondTableProps {
  results: BondScreenResult[];
  watchedIds: string[];
  onRowClick: (record: BondRecord) => void;
  onToggleWatch: (id: string) => void;
  onAdd: (record: BondRecord) => void;
}

/** Screener results table (TanStack): sortable, paginated; rows open details. */
export function BondTable({ results, watchedIds, onRowClick, onToggleWatch, onAdd }: BondTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 12 });
  const watched = useMemo(() => new Set(watchedIds), [watchedIds]);

  const columns = useMemo<ColumnDef<BondScreenResult>[]>(
    () => [
      { id: "ticker", header: "Ticker", accessorFn: (r) => r.record.ticker, cell: ({ row }) => <span className="font-medium">{row.original.record.ticker}</span> },
      { id: "issuer", header: "Issuer", accessorFn: (r) => r.record.issuer, cell: ({ row }) => <span className="text-muted-foreground">{row.original.record.issuer}</span> },
      { id: "coupon", header: "Coupon", accessorFn: (r) => r.record.coupon, cell: ({ row }) => `${formatNumber(row.original.record.coupon, 3)}%` },
      { id: "yield", header: "Yield", accessorFn: (r) => r.yieldPct, cell: ({ row }) => `${formatNumber(row.original.yieldPct, 2)}%` },
      { id: "maturity", header: "Maturity", accessorFn: (r) => r.record.maturityDate, cell: ({ row }) => row.original.record.maturityDate },
      { id: "currency", header: "Ccy", accessorFn: (r) => r.record.currency },
      { id: "rating", header: "Rating", accessorFn: (r) => r.record.rating, cell: ({ row }) => <RatingBadge rating={row.original.record.rating} /> },
      { id: "duration", header: "Mod Dur", accessorFn: (r) => r.modifiedDuration, cell: ({ row }) => formatNumber(row.original.modifiedDuration, 2) },
      { id: "country", header: "Country", accessorFn: (r) => r.record.country },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => {
          const rec = row.original.record;
          return (
            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onToggleWatch(rec.id)} aria-label="Watch">
                <Star className={cn("h-3.5 w-3.5", watched.has(rec.id) && "fill-amber-400 text-amber-400")} />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onAdd(rec)} aria-label="Add to portfolio">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onToggleWatch, onAdd, watched],
  );

  const table = useReactTable<BondScreenResult>({
    data: results,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (results.length === 0) {
    return <EmptyState title="No matches" description="Adjust the search or filters to find bonds." />;
  }

  return (
    <div className="space-y-3">
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
              <TableRow key={row.id} onClick={() => onRowClick(row.original.record)} className="cursor-pointer">
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
        <p className="text-xs text-muted-foreground">{results.length} bonds</p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Previous">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-1 text-xs tabular-nums text-muted-foreground">
            {pagination.pageIndex + 1} / {Math.max(table.getPageCount(), 1)}
          </span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Next">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
