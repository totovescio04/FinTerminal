/**
 * @file index.ts
 * Public surface of the Portfolio Optimization Engine. Asset-class agnostic:
 * give it expected returns + a covariance matrix + constraints.
 */

export type {
  Objective,
  Constraints,
  OptimizationInput,
  OptimizationResult,
  PortfolioStats,
  FrontierPoint,
  RandomPortfolio,
  MonteCarloResult,
} from "./types";
export { DEFAULT_CONSTRAINTS } from "./types";

export { covarianceMatrix, correlationMatrix, covFromVolCorr } from "./covariance";
export { expectedReturnsFromSeries, annualizeReturn, annualizeVol } from "./returns";
export {
  portfolioReturn,
  portfolioVariance,
  portfolioVolatility,
  sharpeRatio,
  sortinoRatio,
  treynorRatio,
  informationRatio,
  calmarRatio,
  portfolioStats,
} from "./statistics";
export { marginalRiskContributions, riskContributions, diversificationRatio } from "./risk";
export { projectToSimplexBox, solveQP, minVarianceWeights } from "./solver";
export { buildBounds, applyMaxAssets } from "./constraints";
export type { Bounds } from "./constraints";
export { efficientFrontier, monteCarlo, maxReturnFeasible } from "./frontier";
export { optimize, maxDiversificationWeights, riskParityWeights } from "./optimizer";
export { validateInput, OptimizationError } from "./validation";
