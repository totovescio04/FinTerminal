/**
 * @file screener-types.ts
 * UI filter form (all strings) plus the mapping to the service's
 * {@link ScreenCriteria}. Keeps the service decoupled from form representation.
 */

import type { ScreenCriteria } from "@/lib/services/bond-service";
import type { RatingClass } from "@/lib/data/bond-model";

export interface FilterForm {
  search: string;
  country: string;
  currency: string;
  sector: string;
  ratingClass: RatingClass | "all";
  issuer: string;
  couponMin: string;
  couponMax: string;
  yieldMin: string;
  yieldMax: string;
  durationMin: string;
  durationMax: string;
  maturityFrom: string;
  maturityTo: string;
}

export const EMPTY_FILTER_FORM: FilterForm = {
  search: "",
  country: "",
  currency: "",
  sector: "",
  ratingClass: "all",
  issuer: "",
  couponMin: "",
  couponMax: "",
  yieldMin: "",
  yieldMax: "",
  durationMin: "",
  durationMax: "",
  maturityFrom: "",
  maturityTo: "",
};

const num = (s: string): number | undefined => (s.trim() === "" || !Number.isFinite(Number(s)) ? undefined : Number(s));

/** Convert the UI filter form into service screening criteria. */
export function toCriteria(form: FilterForm): ScreenCriteria {
  return {
    search: form.search || undefined,
    country: form.country || undefined,
    currency: form.currency || undefined,
    sector: form.sector || undefined,
    issuer: form.issuer || undefined,
    ratingClass: form.ratingClass,
    couponMin: num(form.couponMin),
    couponMax: num(form.couponMax),
    yieldMin: num(form.yieldMin),
    yieldMax: num(form.yieldMax),
    durationMin: num(form.durationMin),
    durationMax: num(form.durationMax),
    maturityFromYear: num(form.maturityFrom),
    maturityToYear: num(form.maturityTo),
  };
}
