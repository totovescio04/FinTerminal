import { marketDataRepository } from "./core";

/** Yield / treasury curves. */
export const yieldCurveService = {
  getCurve: (curveId: string = "UST") => marketDataRepository.getYieldCurve(curveId),
};
