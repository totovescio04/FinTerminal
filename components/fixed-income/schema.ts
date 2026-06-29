/**
 * @file schema.ts
 * Zod schema and inferred type for the Bond Calculator form. Validation mirrors
 * the engine's own guards so the UI never sends inconsistent inputs.
 */

import { z } from "zod";

const FREQUENCY = ["Annual", "Semiannual", "Quarterly", "Monthly"] as const;
const DAY_COUNT = ["ACT/ACT", "30/360", "30E/360", "ACT/365", "ACT/360"] as const;

/** Which field the user is currently driving. */
export type PriceMode = "yield" | "price";

export const bondFormSchema = z
  .object({
    bondName: z.string().min(1, "Required"),
    ticker: z.string().min(1, "Required"),
    faceValue: z.number({ invalid_type_error: "Required" }).positive("Must be > 0"),
    couponRate: z.number({ invalid_type_error: "Required" }).min(0, "Cannot be negative"),
    frequency: z.enum(FREQUENCY),
    issueDate: z.string().min(1, "Required"),
    settlementDate: z.string().min(1, "Required"),
    maturityDate: z.string().min(1, "Required"),
    dayCount: z.enum(DAY_COUNT),
    yield: z.number({ invalid_type_error: "Required" }).positive("Must be > 0"),
    cleanPrice: z.number({ invalid_type_error: "Required" }).positive("Must be > 0"),
  })
  .refine((v) => new Date(v.issueDate) < new Date(v.settlementDate), {
    message: "Issue date must be before settlement",
    path: ["issueDate"],
  })
  .refine((v) => new Date(v.settlementDate) < new Date(v.maturityDate), {
    message: "Settlement must be before maturity",
    path: ["settlementDate"],
  });

/** Form values inferred from {@link bondFormSchema}. */
export type BondFormValues = z.infer<typeof bondFormSchema>;

/** Sensible defaults: a 5% 10-year semiannual ACT/ACT bond. */
export const DEFAULT_BOND_FORM: BondFormValues = {
  bondName: "US Treasury 5% 2030",
  ticker: "T 5 01/30",
  faceValue: 100,
  couponRate: 5,
  frequency: "Semiannual",
  issueDate: "2020-01-15",
  settlementDate: "2025-06-30",
  maturityDate: "2030-01-15",
  dayCount: "ACT/ACT",
  yield: 5,
  cleanPrice: 100,
};
