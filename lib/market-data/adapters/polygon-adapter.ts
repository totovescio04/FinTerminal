import type { OHLCBar } from "@/lib/market-data/types";
import type { DataAdapter } from "./types";

/** Polygon aggregate bar shape. */
export interface PolygonAgg {
  t: number; // epoch ms
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

/** Map a Polygon aggregate into a domain {@link OHLCBar}. */
export const polygonBarAdapter: DataAdapter<PolygonAgg, OHLCBar> = {
  adapt(raw) {
    return {
      date: new Date(raw.t).toISOString().slice(0, 10),
      open: raw.o,
      high: raw.h,
      low: raw.l,
      close: raw.c,
      volume: raw.v,
    };
  },
};
