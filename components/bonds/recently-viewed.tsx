"use client";

import { Clock } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { BondCard } from "./bond-card";
import { useRecent } from "./recent-store";
import { useBondRecordsByIds } from "./use-bond-data";
import { toggleWatch, useWatchlist } from "./watchlist-store";
import type { BondRecord } from "@/lib/data/bond-model";

interface RecentlyViewedProps {
  onSelect: (record: BondRecord) => void;
  onAdd: (record: BondRecord) => void;
}

/** Automatically-tracked recently-viewed bonds. */
export function RecentlyViewed({ onSelect, onAdd }: RecentlyViewedProps) {
  const ids = useRecent();
  const records = useBondRecordsByIds(ids);
  const watched = useWatchlist();
  if (records.length === 0) {
    return <EmptyState icon={Clock} title="Nothing viewed yet" description="Open a bond to see it here." />;
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((record) => (
        <BondCard key={record.id} record={record} watched={watched.includes(record.id)} onSelect={onSelect} onToggleWatch={toggleWatch} onAdd={onAdd} />
      ))}
    </div>
  );
}
