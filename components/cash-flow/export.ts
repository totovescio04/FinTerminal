/**
 * @file export.ts
 * Client-side exporters for the cash-flow table. CSV and Excel are fully
 * implemented; PDF is structured (uses the browser print pipeline) and can be
 * upgraded to a generated document later.
 */

import type { CashFlow } from "@/lib/fixed-income";
import { CASH_FLOW_FIELDS, formatCashFlowCell } from "./cash-flow-fields";

export type ExportFormat = "csv" | "excel" | "pdf";

function totalsRow(rows: CashFlow[]): string[] {
  const totalCoupon = rows.reduce((s, r) => s + r.couponAmount, 0);
  const totalPrincipal = rows.reduce((s, r) => s + r.principalAmount, 0);
  const totalPv = rows.reduce((s, r) => s + r.presentValue, 0);
  return CASH_FLOW_FIELDS.map((f) => {
    if (f.key === "index") return "TOTAL";
    if (f.key === "couponAmount") return totalCoupon.toFixed(4);
    if (f.key === "principalAmount") return totalPrincipal.toFixed(4);
    if (f.key === "presentValue") return totalPv.toFixed(4);
    return "";
  });
}

/** Build a header + body + totals matrix from cash flows. */
export function buildMatrix(rows: CashFlow[]): { headers: string[]; body: string[][]; totals: string[] } {
  return {
    headers: CASH_FLOW_FIELDS.map((f) => f.header),
    body: rows.map((cf) => CASH_FLOW_FIELDS.map((f) => formatCashFlowCell(cf, f))),
    totals: totalsRow(rows),
  };
}

function download(content: BlobPart, filename: string, mime: string): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const escapeCsv = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

/** Export cash flows to a CSV file (includes a totals row). */
export function exportCsv(rows: CashFlow[], filename = "cash-flows.csv"): void {
  const { headers, body, totals } = buildMatrix(rows);
  const lines = [headers, ...body, totals].map((r) => r.map(escapeCsv).join(","));
  download("﻿" + lines.join("\n"), filename, "text/csv;charset=utf-8;");
}

const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Export to an Excel-compatible file. Uses the spreadsheet-readable HTML table
 * format (.xls) so no extra dependency is required.
 */
export function exportExcel(rows: CashFlow[], filename = "cash-flows.xls"): void {
  const { headers, body, totals } = buildMatrix(rows);
  const thead = `<tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr>`;
  const tbody = body.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`).join("");
  const tfoot = `<tr>${totals.map((c) => `<td><b>${escapeHtml(c)}</b></td>`).join("")}</tr>`;
  const html =
    `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">` +
    `<head><meta charset="utf-8" /></head><body><table border="1">${thead}${tbody}${tfoot}</table></body></html>`;
  download(html, filename, "application/vnd.ms-excel");
}

/**
 * Export to PDF. Structured entry point: triggers the browser print pipeline,
 * which can render the current view to PDF. A fully generated PDF document can
 * be wired here later without changing callers.
 */
export function exportPdf(): void {
  if (typeof window === "undefined") return;
  window.print();
}

/** Dispatch to the requested exporter. */
export function exportCashFlows(format: ExportFormat, rows: CashFlow[]): void {
  if (format === "csv") return exportCsv(rows);
  if (format === "excel") return exportExcel(rows);
  return exportPdf();
}
