/**
 * @file export.ts
 * Export the comparison matrix to CSV / Excel / PDF. Presentation-only — values
 * come from the metric descriptors (engine analytics).
 */

import { METRICS } from "./metrics";
import type { ComparisonResult } from "./types";

export type ExportFormat = "csv" | "excel" | "pdf";

function matrix(results: ComparisonResult[]): { headers: string[]; rows: string[][] } {
  const headers = ["Metric", ...results.map((r) => r.bond.ticker)];
  const rows = METRICS.map((m) => [m.label, ...results.map((r) => m.display(r))]);
  return { headers, rows };
}

function download(content: BlobPart, filename: string, mime: string): void {
  if (typeof document === "undefined") return;
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const csvCell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
const htmlCell = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function exportComparison(format: ExportFormat, results: ComparisonResult[]): void {
  if (results.length === 0) return;
  const { headers, rows } = matrix(results);
  if (format === "csv") {
    const lines = [headers, ...rows].map((r) => r.map(csvCell).join(","));
    download("﻿" + lines.join("\n"), "comparison.csv", "text/csv;charset=utf-8;");
    return;
  }
  if (format === "excel") {
    const thead = `<tr>${headers.map((h) => `<th>${htmlCell(h)}</th>`).join("")}</tr>`;
    const tbody = rows.map((r) => `<tr>${r.map((c) => `<td>${htmlCell(c)}</td>`).join("")}</tr>`).join("");
    const html = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8" /></head><body><table border="1">${thead}${tbody}</table></body></html>`;
    download(html, "comparison.xls", "application/vnd.ms-excel");
    return;
  }
  if (typeof window !== "undefined") window.print();
}
