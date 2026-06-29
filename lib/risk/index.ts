/**
 * @file index.ts
 * Public surface of the Risk layer. Pure functions over engine-derived numbers;
 * no financial pricing math lives here.
 */

export type {
  CouponType,
  RiskPosition,
  RiskAggregate,
  ExposureSlice,
  MaturityBucket,
  RiskContribution,
  VaRResult,
  ScenarioPoint,
  StressResult,
} from "./types";

export {
  exposureBy,
  exposureByIssuer,
  exposureByCountry,
  exposureByCurrency,
  exposureBySector,
  exposureByRating,
  exposureByCouponType,
  maturityBuckets,
  MATURITY_BUCKETS,
} from "./exposure";
export { aggregateRisk } from "./aggregate";
export { parametricVaR, historicalVaR, monteCarloVaR, VAR_Z } from "./var";
export type { ParametricVaRParams } from "./var";
export { STRESS_SCENARIOS, stressShiftBps } from "./stress";
export type { StressScenario, StressType } from "./stress";
export { riskContributions } from "./contribution";
export { riskHeatmap } from "./heatmap";
export type { RiskHeatmapData } from "./heatmap";
export { topRisks } from "./top-risks";
export type { TopRisks, TopRiskItem } from "./top-risks";
