import { describe, expect, it } from "vitest";
import { bootstrap } from "../bootstrap";
import { discountFactor } from "../discount";
import { zeroRate } from "../spot";

describe("bootstrap", () => {
  it("flat par curve yields a flat zero curve", () => {
    const curve = bootstrap([1, 2, 3, 5, 10].map((t) => ({ tenor: t, parRate: 0.05 })));
    for (const t of [1, 2, 3, 5, 10]) {
      expect(zeroRate(curve, t)).toBeCloseTo(0.05, 9);
      expect(discountFactor(curve, t)).toBeCloseTo(Math.pow(1.05, -t), 9);
    }
  });

  it("reprices par bonds back to par (consecutive tenors)", () => {
    const inputs = [
      { tenor: 1, parRate: 0.03 },
      { tenor: 2, parRate: 0.035 },
      { tenor: 3, parRate: 0.04 },
      { tenor: 4, parRate: 0.042 },
      { tenor: 5, parRate: 0.045 },
    ];
    const curve = bootstrap(inputs);
    for (const { tenor, parRate } of inputs) {
      let price = 0;
      for (let i = 1; i <= tenor; i++) price += parRate * discountFactor(curve, i);
      price += discountFactor(curve, tenor); // principal
      expect(price).toBeCloseTo(1, 9);
    }
  });

  it("produces decreasing discount factors", () => {
    const curve = bootstrap([1, 2, 5, 10, 30].map((t) => ({ tenor: t, parRate: 0.04 })));
    let prev = 1;
    for (const t of [1, 2, 5, 10, 30]) {
      const df = discountFactor(curve, t);
      expect(df).toBeLessThan(prev);
      prev = df;
    }
  });
});
