"use client";

import { Plus, Search, SlidersHorizontal, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PortfolioToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  onAdd: () => void;
  onToggleFilters: () => void;
  onClear: () => void;
}

/** Top toolbar: instant search, add holding, filters, import (prepared), clear. */
export function PortfolioToolbar({ search, onSearch, onAdd, onToggleFilters, onClear }: PortfolioToolbarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search ticker or issuer…" className="pl-9" aria-label="Search holdings" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToggleFilters}>
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Import holdings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>CSV <Badge variant="muted" className="ml-auto">Soon</Badge></DropdownMenuItem>
            <DropdownMenuItem disabled>Excel <Badge variant="muted" className="ml-auto">Soon</Badge></DropdownMenuItem>
            <DropdownMenuItem disabled>Market API <Badge variant="muted" className="ml-auto">Soon</Badge></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
        <Button size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add Bond
        </Button>
      </div>
    </div>
  );
}
