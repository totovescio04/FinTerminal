"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BondSearchInput } from "./bond-search-input";

interface BondSearchProps {
  search: string;
  onSearch: (value: string) => void;
  onToggleFilters: () => void;
  resultCount: number;
}

/** Search row: instant input + filters toggle + result count. */
export function BondSearch({ search, onSearch, onToggleFilters, resultCount }: BondSearchProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="flex-1">
        <BondSearchInput value={search} onChange={onSearch} />
      </div>
      <div className="flex items-center gap-3">
        <span className="whitespace-nowrap text-xs text-muted-foreground">{resultCount} bonds</span>
        <Button variant="outline" size="sm" onClick={onToggleFilters}>
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>
    </div>
  );
}
