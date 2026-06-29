import { describe, expect, it } from "vitest";
import { riskContributions } from "../contribution";
import { aggregateRisk } from "../aggregate";
import { riskHeatmap } from "../heatmap";
import { topRisks } from "../top-risks";
import { POSITIONS } from "./fixtures";

describe("contribution / heatmap / top risks", () => {
  it("duration contributions sum to portfolio duration", () => {
    const contribs = riskContributions(POSITIONS);
    const sum = contribs.reduce((s, c) => s + c.durationContribution, 0);
    expect(sum).toBeCloseTo(aggregateRisk(POSITIONS).modifiedDuration, 9);
  });
  it("DV01 weights sum to 1", () => {
    const sum = riskContributions(POSITIONS).reduce((s, c) => s + c.dv01Weight, 0);
    expect(sum).toBeCloseTo(1, 9);
  });
  it("heatmap cells total the market value", () => {
    const hm = riskHeatmap(POSITIONS);
    const total = hm.cells.flat().reduce((s, v) => s + v, 0);
    expect(total).toBe(4_000_000);
  });
  it("top risks identify the right positions", () => {
    const t = topRisks(POSITIONS);
    expect(t.highestDuration!.id).toBe("c");
    expect(t.highestDv01!.id).toBe("c");
    expect(t.largestExposure!.id).toBe("b");
    expect(t.topConcentration!.value).toBeCloseTo(0.5, 9);
  });
});
