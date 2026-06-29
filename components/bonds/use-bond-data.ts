"use client";

import { useEffect, useState } from "react";
import {
  bondService,
  type BondScreenResult,
  type ScreenCriteria,
} from "@/lib/services/bond-service";
import type { BondRecord } from "@/lib/data/bond-model";

/** Run the screener whenever criteria change. Components never touch the JSON. */
export function useBondScreener(criteria: ScreenCriteria): { results: BondScreenResult[]; loading: boolean } {
  const [results, setResults] = useState<BondScreenResult[]>([]);
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(criteria);

  useEffect(() => {
    let active = true;
    setLoading(true);
    bondService.screen(criteria).then((r) => {
      if (active) {
        setResults(r);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { results, loading };
}

/** Load a single bond record by id. */
export function useBondRecord(id: string): { record: BondRecord | null; loading: boolean } {
  const [record, setRecord] = useState<BondRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    bondService.getById(id).then((r) => {
      if (active) {
        setRecord(r);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [id]);

  return { record, loading };
}

/** Load distinct facet values for filter dropdowns (once). */
export function useBondFacets(): { countries: string[]; currencies: string[]; sectors: string[] } {
  const [facets, setFacets] = useState<{ countries: string[]; currencies: string[]; sectors: string[] }>({
    countries: [],
    currencies: [],
    sectors: [],
  });
  useEffect(() => {
    let active = true;
    bondService.facets().then((f) => {
      if (active) setFacets(f);
    });
    return () => {
      active = false;
    };
  }, []);
  return facets;
}

/** Resolve a list of ids to records (for watchlist / recently-viewed). */
export function useBondRecordsByIds(ids: string[]): BondRecord[] {
  const [records, setRecords] = useState<BondRecord[]>([]);
  const key = ids.join(",");
  useEffect(() => {
    let active = true;
    bondService.getAll().then((all) => {
      if (!active) return;
      const map = new Map(all.map((b) => [b.id, b]));
      setRecords(ids.map((id) => map.get(id)).filter((b): b is BondRecord => Boolean(b)));
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return records;
}
