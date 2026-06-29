/**
 * @file types.ts
 * Adapter Pattern: a DataAdapter maps a vendor's raw payload shape into a
 * FinTerminal domain type. Each vendor gets its own adapter; the rest of the
 * system only ever sees domain types.
 */

export interface DataAdapter<TRaw, TDomain> {
  adapt(raw: TRaw): TDomain;
}
