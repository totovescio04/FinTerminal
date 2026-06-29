"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils/format";
import { bp } from "./format";
import type { HeatCell } from "./scenario-engine";

interface SensitivityHeatmapProps {
  cells: HeatCell[][];
  shiftsBp: number[];
  maturityOffsets: number[];
}

function cellColor(price: number, min: number, max: number): string {
  const t = max === min ? 0.5 : (price - min) / (max - min);
  const hue = t * 140; // red (low) -> green (high)
  return `hsl(${hue} 70% 86%)`;
}

/** Heatmap of bond price across yield shifts (rows) and maturities (columns). */
export function SensitivityHeatmap({ cells, shiftsBp, maturityOffsets }: SensitivityHeatmapProps) {
  const valid = cells.flat().map((c) => c.price).filter((p): p is number => p !== null);
  const min = valid.length ? Math.min(...valid) : 0;
  const max = valid.length ? Math.max(...valid) : 1;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Sensitivity Matrix</CardTitle>
        <CardDescription>Clean price by yield shift (rows) and maturity (columns).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-1 text-xs">
            <thead>
              <tr>
                <th className="p-1 text-left font-medium text-muted-foreground">Yield \ Mat.</th>
                {maturityOffsets.map((off) => (
                  <th key={off} className="p-1 text-center font-medium text-muted-foreground">
                    {off === 0 ? "M" : `M${off > 0 ? "+" : ""}${off}y`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cells.map((row, i) => (
                <tr key={shiftsBp[i]}>
                  <td className="whitespace-nowrap p-1 font-medium tabular-nums text-muted-foreground">{bp(shiftsBp[i]!)}</td>
                  {row.map((cell, j) => (
                    <td
                      key={`${i}-${j}`}
                      className="rounded-md p-2 text-center font-medium tabular-nums"
                      style={
                        cell.price === null
                          ? { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }
                          : { background: cellColor(cell.price, min, max), color: "hsl(222 47% 18%)" }
                      }
                    >
                      {cell.price === null ? "—" : formatNumber(cell.price, 2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
