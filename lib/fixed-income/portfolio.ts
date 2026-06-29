/**
 * @file portfolio.ts
 * Portfolio-level aggregation of fixed-income analytics.
 *
 * Reference: portfolio duration/convexity as market-value-weighted averages of
 * the constituent bonds.
 */

import type { PortfolioMetrics, PortfolioPosition } from "./types";
import { computePriceComponents } from "./pricing";
import { macaulayDuration, modifiedDuration } from "./duration";
import { convexity } from "./convexity";
import { dv01 } from "./risk";

/**
 * Dirty market value of a single position (currency).
 * @returns dirtyPrice/100 * faceValue * quantity.
 */
export function positionMarketValue(position: PortfolioPosition): number {
  const pc = computePriceComponents(position.bond, position.yield);
  return (pc.dirtyPrice / 100) * position.bond.faceValue * position.quantity;
}

/**
 * Aggregate analytics across a set of positions.
 *
 * @param positions Portfolio positions.
 * @returns A {@link PortfolioMetrics}. Yield, modified/Macaulay duration and
 *          convexity are market-value-weighted; average coupon is
 *          face-value-weighted; DV01 is summed in currency.
 */
export function portfolioMetrics(positions: PortfolioPosition[]): PortfolioMetrics {
  let marketValue = 0;
  let totalFaceValue = 0;
  let yieldWeighted = 0;
  let couponWeighted = 0;
  let modifiedWeighted = 0;
  let macaulayWeighted = 0;
  let convexityWeighted = 0;
  let dv01Total = 0;

  for (const position of positions) {
    const value = positionMarketValue(position);
    const faceTotal = position.bond.faceValue * position.quantity;
    marketValue += value;
    totalFaceValue += faceTotal;
    yieldWeighted += position.yield * value;
    couponWeighted += position.bond.couponRate * faceTotal;
    modifiedWeighted += modifiedDuration(position.bond, position.yield) * value;
    macaulayWeighted += macaulayDuration(position.bond, position.yield) * value;
    convexityWeighted += convexity(position.bond, position.yield) * value;
    // dv01 is per 100 face; scale to the position's face value.
    dv01Total += dv01(position.bond, position.yield) * (faceTotal / 100);
  }

  const safeMV = marketValue === 0 ? 1 : marketValue;
  const safeFace = totalFaceValue === 0 ? 1 : totalFaceValue;

  return {
    marketValue,
    totalFaceValue,
    averageYield: yieldWeighted / safeMV,
    averageCoupon: couponWeighted / safeFace,
    macaulayDuration: macaulayWeighted / safeMV,
    modifiedDuration: modifiedWeighted / safeMV,
    convexity: convexityWeighted / safeMV,
    dv01: dv01Total,
  };
}
