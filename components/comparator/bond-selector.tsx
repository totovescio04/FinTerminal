"use client";

import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useWatchlist } from "@/components/bonds";
import { useBondRecordsByIds, useBondScreener } from "@/components/bonds/use-bond-data";
import { usePortfolio } from "@/components/portfolio";
import { fromPosition, fromRecord } from "./instrument";
import { BOND_COLORS, MAX_COMPARE, type ComparatorBond } from "./types";

interface BondSelectorProps {
  selected: ComparatorBond[];
  onAdd: (bond: ComparatorBond) => void;
  onRemove: (id: string) => void;
}

type Tab = "database" | "watchlist" | "portfolio";

function Row({ label, sub, disabled, onAdd }: { label: string; sub: string; disabled: boolean; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{label}</p>
        <p className="truncate text-xs text-muted-foreground">{sub}</p>
      </div>
      <Button variant="ghost" size="icon" className="h-7 w-7" disabled={disabled} onClick={onAdd} aria-label="Add">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

/** Pick up to 4 bonds from the Database, Watchlist or Portfolio. */
export function BondSelector({ selected, onAdd, onRemove }: BondSelectorProps) {
  const [tab, setTab] = useState<Tab>("database");
  const [search, setSearch] = useState("");
  const { results } = useBondScreener({ search });
  const watchIds = useWatchlist();
  const watchRecords = useBondRecordsByIds(watchIds);
  const positions = usePortfolio();

  const full = selected.length >= MAX_COMPARE;
  const has = (id: string) => selected.some((b) => b.id === id);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selected.map((b, i) => (
          <Badge key={b.id} variant="secondary" className="gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: BOND_COLORS[i] }} />
            {b.ticker}
            <button type="button" onClick={() => onRemove(b.id)} aria-label="Remove">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {selected.length === 0 && <span className="text-xs text-muted-foreground">No bonds selected — add up to {MAX_COMPARE}.</span>}
      </div>

      <div className="flex gap-1 rounded-lg bg-muted p-1 text-xs">
        {(["database", "watchlist", "portfolio"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn("flex-1 rounded-md px-2 py-1.5 font-medium capitalize transition-colors", tab === t ? "bg-background shadow-soft" : "text-muted-foreground")}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "database" && (
        <div className="space-y-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bonds…" className="pl-9" />
          </div>
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {results.slice(0, 25).map((r) => (
              <Row key={r.record.id} label={r.record.ticker} sub={r.record.name} disabled={full || has(`db:${r.record.id}`)} onAdd={() => onAdd(fromRecord(r.record))} />
            ))}
          </div>
        </div>
      )}

      {tab === "watchlist" && (
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {watchRecords.length === 0 ? (
            <p className="text-xs text-muted-foreground">No bonds in your watchlist.</p>
          ) : (
            watchRecords.map((rec) => (
              <Row key={rec.id} label={rec.ticker} sub={rec.name} disabled={full || has(`db:${rec.id}`)} onAdd={() => onAdd(fromRecord(rec))} />
            ))
          )}
        </div>
      )}

      {tab === "portfolio" && (
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {positions.length === 0 ? (
            <p className="text-xs text-muted-foreground">No portfolio holdings.</p>
          ) : (
            positions.map((p) => (
              <Row key={p.id} label={p.ticker} sub={p.bondName} disabled={full || has(`pf:${p.id}`)} onAdd={() => onAdd(fromPosition(p))} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
