/**
 * @file validation.ts
 * Input validation and bond normalization. All analytics entry points should
 * receive a {@link Bond} produced by {@link createBond}.
 */

import type { Bond, BondInput, Frequency } from "./types";
import { FREQUENCY_PERIODS } from "./constants";
import { compareDates, toUTCMidnight } from "./utils";

/** Error thrown when a bond or numeric input fails validation. */
export class BondValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BondValidationError";
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new BondValidationError(message);
}

/** True if `value` is a finite number (rejects null/undefined/NaN/Infinity). */
function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

const VALID_FREQUENCIES: Frequency[] = ["Annual", "Semiannual", "Quarterly", "Monthly"];

/**
 * Validate that a frequency is supported.
 * @throws {BondValidationError} on an unknown frequency.
 */
export function assertValidFrequency(frequency: Frequency): void {
  assert(
    VALID_FREQUENCIES.includes(frequency) && frequency in FREQUENCY_PERIODS,
    `Invalid payment frequency: ${String(frequency)}`,
  );
}

/**
 * Validate a yield value.
 * @throws {BondValidationError} if the yield is null/NaN or below -100%/m.
 */
export function assertValidYield(yld: number): void {
  assert(isFiniteNumber(yld), "Yield must be a finite number");
  assert(yld > -1, "Yield must be greater than -100%");
}

/**
 * Validate a price value (must be a positive finite number).
 * @throws {BondValidationError} on a null/NaN/negative price.
 */
export function assertValidPrice(price: number): void {
  assert(isFiniteNumber(price), "Price must be a finite number");
  assert(price > 0, "Price must be positive");
}

/**
 * Validate a raw {@link BondInput}, checking for null values, negative coupon,
 * invalid frequency, inconsistent or matured dates.
 * @throws {BondValidationError} describing the first problem found.
 */
export function validateBondInput(input: BondInput): void {
  assert(input !== null && typeof input === "object", "Bond input is required");
  assert(isFiniteNumber(input.faceValue), "faceValue must be a finite number");
  assert(input.faceValue > 0, "faceValue must be positive");
  assert(isFiniteNumber(input.couponRate), "couponRate must be a finite number");
  assert(input.couponRate >= 0, "couponRate cannot be negative");
  if (input.redemption !== undefined) {
    assert(isFiniteNumber(input.redemption), "redemption must be a finite number");
    assert(input.redemption > 0, "redemption must be positive");
  }
  assertValidFrequency(input.frequency);

  assert(input.issueDate instanceof Date && !isNaN(input.issueDate.getTime()), "issueDate is invalid");
  assert(
    input.maturityDate instanceof Date && !isNaN(input.maturityDate.getTime()),
    "maturityDate is invalid",
  );
  assert(
    input.settlementDate instanceof Date && !isNaN(input.settlementDate.getTime()),
    "settlementDate is invalid",
  );

  assert(compareDates(input.issueDate, input.maturityDate) < 0, "issueDate must be before maturityDate");
  assert(
    compareDates(input.settlementDate, input.maturityDate) < 0,
    "Bond has matured: settlementDate is on/after maturityDate",
  );
  assert(
    compareDates(input.settlementDate, input.issueDate) >= 0,
    "settlementDate must be on/after issueDate",
  );
}

/**
 * Validate and normalize a {@link BondInput} into a {@link Bond}.
 * Dates are normalized to UTC midnight and `redemption` defaults to `faceValue`.
 * @returns A normalized, validated {@link Bond}.
 * @throws {BondValidationError} if validation fails.
 */
export function createBond(input: BondInput): Bond {
  validateBondInput(input);
  return {
    faceValue: input.faceValue,
    couponRate: input.couponRate,
    issueDate: toUTCMidnight(input.issueDate),
    maturityDate: toUTCMidnight(input.maturityDate),
    settlementDate: toUTCMidnight(input.settlementDate),
    frequency: input.frequency,
    dayCount: input.dayCount,
    redemption: input.redemption ?? input.faceValue,
    firstCouponDate: input.firstCouponDate ? toUTCMidnight(input.firstCouponDate) : undefined,
    lastCouponDate: input.lastCouponDate ? toUTCMidnight(input.lastCouponDate) : undefined,
  };
}
