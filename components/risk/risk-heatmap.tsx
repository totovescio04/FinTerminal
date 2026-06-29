"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";
import type { RiskHeatmapData } from "@/lib/risk";

function color(value: number, max: number): string {
  if (value <= 0) return "hsl(var(--muted))";
  const t = max === 0 ? 0 : value / max;
  return `hsl(217 91% ${92 - t * 40}%)`;
}

/** Market value heatmap: duration (rows) × yield (cols). */
export function RiskHeatmap({ data }: { data: RiskHeatmapData }) {
  const max = Math.max(...data.cells.flat(), 0);
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Risk Heatmap</CardTitle>
        <CardDescription>Portfolio market value by duration (rows) × yield (columns).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-1 text-xs">
            <thead>
              <tr>
                <th className="p-1 text-left font-medium text-muted-foreground">Dur \ Yld</th>
                {data.yieldLabels.map((y) => (
                  <th key={y} className="p-1 text-center font-medium text-muted-foreground">{y}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.cells.map((row, i) => (
                <tr key={data.durationLabels[i]}>
                  <td className="whitespace-nowrap p-1 font-medium text-muted-foreground">{data.durationLabels[i]}</td>
                  {row.map((v, j) => (
                    <td
                      key={j}
                      className="rounded-md p-2 text-center tabular-nums"
                      style={{ background: color(v, max), color: v > max * 0.55 ? "white" : "hsl(222 47% 18%)" }}
                      title={formatCurrency(v)}
                    >
                      {v > 0 ? (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)) : "·"}
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
