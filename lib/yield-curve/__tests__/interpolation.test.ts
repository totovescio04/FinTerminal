import { describe, expect, it } from "vitest";
import { cubicSpline, interpolate, linearArray } from "../interpolation";

describe("interpolation", () => {
  const xs = [1, 2, 5, 10];
  const ys = [0.04, 0.045, 0.05, 0.048];

  it("linear is exact at nodes", () => {
    xs.forEach((x, i) => expect(linearArray(x, xs, ys)).toBeCloseTo(ys[i]!, 12));
  });

  it("linear midpoint", () => {
    expect(linearArray(1.5, xs, ys)).toBeCloseTo(0.0425, 12);
  });

  it("linear flat-extrapolates beyond ends", () => {
    expect(linearArray(0.5, xs, ys)).toBeCloseTo(0.04, 12);
    expect(linearArray(30, xs, ys)).toBeCloseTo(0.048, 12);
  });

  it("cubic spline passes through nodes", () => {
    const f = cubicSpline(xs, ys);
    xs.forEach((x, i) => expect(f(x)).toBeCloseTo(ys[i]!, 9));
  });

  it("logLinear interpolates positive values", () => {
    const v = interpolate(1.5, xs, ys, "logLinear");
    expect(v).toBeGreaterThan(0.04);
    expect(v).toBeLessThan(0.045);
  });
});
