import { describe, expect, it } from "vitest";
import { correlationMatrix, covFromVolCorr, covarianceMatrix } from "../covariance";

describe("covariance / correlation", () => {
  it("covFromVolCorr puts vol² on the diagonal", () => {
    const cov = covFromVolCorr([0.1, 0.2], [[1, 0.5], [0.5, 1]]);
    expect(cov[0]![0]).toBeCloseTo(0.01, 12);
    expect(cov[1]![1]).toBeCloseTo(0.04, 12);
    expect(cov[0]![1]).toBeCloseTo(0.5 * 0.1 * 0.2, 12);
  });
  it("correlation has unit diagonal and recovers rho", () => {
    const cov = covFromVolCorr([0.1, 0.2], [[1, 0.3], [0.3, 1]]);
    const corr = correlationMatrix(cov);
    expect(corr[0]![0]).toBeCloseTo(1, 12);
    expect(corr[0]![1]).toBeCloseTo(0.3, 12);
  });
  it("sample covariance from a returns matrix", () => {
    const cov = covarianceMatrix([[1, 2, 3], [2, 4, 6]]);
    expect(cov[0]![0]).toBeCloseTo(1, 12); // var of [1,2,3] = 1
    expect(cov[0]![1]).toBeCloseTo(2, 12); // cov with [2,4,6] = 2
  });
});
