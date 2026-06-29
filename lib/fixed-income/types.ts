/**
 * @file types.ts
 * Domain contracts for the FinTerminal fixed-income engine.
 * Every public function is typed against these interfaces — no `any` is used
 * anywhere in the engine.
 */

/** Day-count conventions supported by the engine. */
export type DayCountConvention =
  | "ACT/ACT" // Actual/Actual (ISDA)
  | "30/360" // 30/360 US (Bond Basis)
  | "30E/360" // 30E/360 (Eurobond Basis)
  | "ACT/365" // Actual/365 (Fixed)
  | "ACT/360"; // Actual/360

/** Coupon payment frequencies. */
export type Frequency = "Annual" | "Semiannual" | "Quarterly" | "Monthly";

/** Interest compounding conventions used for discounting. */
export type CompoundingConvention =
  | "Annual"
  | "Semiannual"
  | "Quarterly"
  | "Monthly"
  | "Continuous";

/** Classification of a coupon period relative to a regular period. */
export type StubType = "regular" | "short" | "long";

/** Raw bond definition as provided by a caller. */
export interface BondInput {
  /** Par / nominal amount (e.g. 100 or 1000). */
  faceValue: number;
  /** Annual coupon rate as a decimal (e.g. 0.05 for 5%). */
  couponRate: number;
  /** Dated date — when interest begins to accrue. */
  issueDate: Date;
  /** Redemption date. */
  maturityDate: Date;
  /** Settlement (valuation) date. */
  settlementDate: Date;
  /** Coupon payment frequency. */
  frequency: Frequency;
  /** Day-count convention. */
  dayCount: DayCountConvention;
  /** Redemption value; defaults to {@link BondInput.faceValue}. */
  redemption?: number;
  /** Explicit first coupon date for an odd first period (optional). */
  firstCouponDate?: Date;
  /** Explicit penultimate coupon date for an odd last period (optional). */
  lastCouponDate?: Date;
}

/** Normalized, validated bond ready for analytics. */
export interface Bond extends BondInput {
  redemption: number;
}

/** A single coupon accrual period within a schedule. */
export interface Coupon {
  /** 1-based position in the schedule. */
  index: number;
  /** Accrual start date (previous coupon date). */
  startDate: Date;
  /** Accrual end date (= payment date). */
  endDate: Date;
  /** Cash payment date. */
  paymentDate: Date;
  /** Whether the period has a regular length. */
  isRegular: boolean;
  /** Stub classification. */
  stub: StubType;
}

/** A generated payment schedule. */
export interface Schedule {
  /** Ordered coupon periods from first to maturity. */
  periods: Coupon[];
  /** Ordered cash payment dates. */
  couponDates: Date[];
  /** Payment frequency. */
  frequency: Frequency;
  /** Coupon periods per year. */
  periodsPerYear: number;
}

/** A single projected cash flow with discounting information. */
export interface CashFlow {
  /** 1-based index among the valued cash flows. */
  index: number;
  /** Payment date. */
  paymentDate: Date;
  /** Coupon component (currency, on face value). */
  couponAmount: number;
  /** Principal / redemption component (currency). */
  principalAmount: number;
  /** Total cash flow (coupon + principal). */
  totalCashFlow: number;
  /** Number of accrual days in this coupon period. */
  accrualDays: number;
  /** Time from settlement to payment, in years. */
  yearFraction: number;
  /** Discount factor applied to this cash flow. */
  discountFactor: number;
  /** Present value of this cash flow (currency). */
  presentValue: number;
  /** Principal outstanding after this payment (currency). */
  remainingPrincipal: number;
}

/** Result of valuing a bond from a yield. */
export interface PricingResult {
  /** Yield used (decimal, per annum, compounded at the coupon frequency). */
  yield: number;
  /** Clean price per 100 of face value. */
  cleanPrice: number;
  /** Dirty (full) price per 100 of face value. */
  dirtyPrice: number;
  /** Accrued interest per 100 of face value. */
  accruedInterest: number;
  /** Present value in currency (dirty price scaled to face value). */
  presentValue: number;
  /** Valued cash flows. */
  cashFlows: CashFlow[];
}

/** Result of a yield solve. */
export interface YieldResult {
  /** Solved yield (decimal). */
  yield: number;
  /** Iterations consumed. */
  iterations: number;
  /** Whether the solver converged within tolerance. */
  converged: boolean;
  /** Numerical method that produced the result. */
  method: "newton-raphson" | "bisection";
  /** Tolerance used. */
  tolerance: number;
}

/** Bundle of duration measures. */
export interface DurationResult {
  /** Macaulay duration (years). */
  macaulay: number;
  /** Modified duration (years). */
  modified: number;
  /** Dollar (money) duration per 100 of face value. */
  dollar: number;
  /** Effective duration (years), computed by repricing. */
  effective: number;
}

/** Bundle of risk measures. */
export interface RiskMetrics {
  /** Macaulay duration (years). */
  macaulayDuration: number;
  /** Modified duration (years). */
  modifiedDuration: number;
  /** Dollar value of a basis point, per 100 of face value. */
  dv01: number;
  /** Price value of a basis point, per 100 of face value. */
  pvbp: number;
  /** Convexity (years^2). */
  convexity: number;
}

/** A single discount factor at a point in time. */
export interface DiscountFactor {
  /** Time in years. */
  time: number;
  /** Discount factor at {@link DiscountFactor.time}. */
  factor: number;
}

/** A point on a yield/zero curve. */
export interface CurvePoint {
  /** Tenor in years. */
  tenor: number;
  /** Zero/spot rate (decimal). */
  rate: number;
}

/** A yield/zero curve. */
export interface YieldCurve {
  /** Ordered curve points. */
  points: CurvePoint[];
  /** Compounding convention of the rates. */
  compounding: CompoundingConvention;
  /** Day-count convention of the rates (optional metadata). */
  dayCount?: DayCountConvention;
}

/** A position held in a portfolio. */
export interface PortfolioPosition {
  /** The bond held. */
  bond: Bond;
  /** Yield to maturity of the position (decimal). */
  yield: number;
  /** Number of face-value units held (e.g. notional / faceValue). */
  quantity: number;
}

/** Aggregated portfolio analytics. */
export interface PortfolioMetrics {
  /** Total dirty market value (currency). */
  marketValue: number;
  /** Total face value (currency). */
  totalFaceValue: number;
  /** Market-value-weighted yield (decimal). */
  averageYield: number;
  /** Face-value-weighted coupon rate (decimal). */
  averageCoupon: number;
  /** Market-value-weighted Macaulay duration (years). */
  macaulayDuration: number;
  /** Market-value-weighted modified duration (years). */
  modifiedDuration: number;
  /** Market-value-weighted convexity (years^2). */
  convexity: number;
  /** Aggregate DV01 (currency per basis point). */
  dv01: number;
}

/** Result of a day-count computation. */
export interface DayCountResult {
  /** Days counted between the two dates per the convention. */
  days: number;
  /** Denominator (days in the reference year/period) used. */
  periodDays: number;
  /** Year fraction (days / periodDays). */
  fraction: number;
}

/** Options for the numerical root solver. */
export interface SolverOptions {
  /** Convergence tolerance (default {@link DEFAULT_TOLERANCE}). */
  tolerance?: number;
  /** Maximum iterations (default {@link DEFAULT_MAX_ITERATIONS}). */
  maxIterations?: number;
  /** Initial guess for Newton-Raphson. */
  guess?: number;
  /** Lower bound for the bisection bracket. */
  lowerBound?: number;
  /** Upper bound for the bisection bracket. */
  upperBound?: number;
}
