"use client";

import { Download, FileSpreadsheet, FileText, FileType } from "lucide-react";
import type { CashFlow } from "@/lib/fixed-income";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportCashFlows } from "./export";

interface ExportMenuProps {
  rows: CashFlow[];
}

/** Export dropdown: CSV and Excel (implemented) + PDF (print pipeline). */
export function ExportMenu({ rows }: ExportMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Export cash flows</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => exportCashFlows("csv", rows)}>
          <FileText />
          CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportCashFlows("excel", rows)}>
          <FileSpreadsheet />
          Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportCashFlows("pdf", rows)}>
          <FileType />
          PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
