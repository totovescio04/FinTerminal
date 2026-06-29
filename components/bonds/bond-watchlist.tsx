"use client";

import { Star } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { BondCard } from "./bond-card";
import { toggleWatch, useWatchlist } from "./watchlist-store";
import { useBondRecordsByIds } from "./use-bond-data";
import type { BondRecord } from "@/lib/data/bond-model";

interface BondWatchlistProps {
  onSelect: (record: BondRecord) => void;
  onAdd: (record: BondRecord) => void;
}

/** Saved favourites, persisted in localStorage. */
export function BondWatchlist({ onSelect, onAdd }: BondWatchlistProps) {
  const ids = useWatchlist();
  const records = useBondRecordsByIds(ids);
  if (records.length === 0) {
    return <EmptyState icon={Star} title="No bonds saved" description="Star a bond to add it to your watchlist." />;
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((record) => (
        <BondCard key={record.id} record={record} watched onSelect={onSelect} onToggleWatch={toggleWatch} onAdd={onAdd} />
      ))}
    </div>
  );
}
