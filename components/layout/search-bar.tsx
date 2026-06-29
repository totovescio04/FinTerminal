"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/** Visual-only command/search field (no behaviour yet). */
export function SearchBar() {
  return (
    <div className="relative hidden w-full max-w-sm md:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search bonds, issuers, CUSIP…"
        className="pl-9"
        aria-label="Search"
      />
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 select-none rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
        ⌘K
      </kbd>
    </div>
  );
}
