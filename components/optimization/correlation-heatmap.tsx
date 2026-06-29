"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function cellColor(v: number): string {
  // -1 (red) → 0 (neutral) → 1 (blue)
  const t = (v + 1) / 2;
  const hue = 0 + t * 217;
  return `hsl(${hue} 70% ${88 - Math.abs(v) * 20}%)`;
}

/** Correlation matrix heatmap. */
export function CorrelationHeatmap({ corr, labels }: { corr: number[][]; labels: string[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Correlation Matrix</CardTitle>
        <CardDescription>Pairwise return correlation (risk model).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="border-separate border-spacing-1 text-[10px]">
            <thead>
              <tr>
                <th className="p-1" />
                {labels.map((l) => (
                  <th key={l} className="max-w-[48px] truncate p-1 text-center font-medium text-muted-foreground">{l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {corr.map((row, i) => (
                <tr key={labels[i]}>
                  <td className="whitespace-nowrap p-1 font-medium text-muted-foreground">{labels[i]}</td>
                  {row.map((v, j) => (
                    <td key={j} className="rounded p-1.5 text-center tabular-nums" style={{ background: cellColor(v), color: "hsl(222 47% 18%)" }} title={`${labels[i]} / ${labels[j]}`}>
                      {v.toFixed(2)}
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
