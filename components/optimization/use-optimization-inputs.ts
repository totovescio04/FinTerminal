"use client";

import { useMemo } from "react";
import { useRiskBook } from "@/components/risk";
import { covFromVolCorr } from "@/lib/portfolio-optimization";

/** Annualized yield volatility used to map duration → return volatility. */
const YIELD_VOL_ANNUAL = 0.0103; // ≈ 6.5bp/day × √252

export interface OptAsset {
  id: string;
  label: string;
  yield: number;
  modifiedDuration: number;
  convexity: number;
  marketValue: number;
  dv01PerMv: number;
  currency: string;
  sector: string;
}

export interface OptimizationInputs {
  assets: OptAsset[];
  mu: number[];
  Sigma: number[][];
  corr: number[][];
  currentWeights: number[];
  totalMarketValue: number;
  loading: boolean;
}

function correlation(a: OptAsset, b: OptAsset): number {
  if (a.id === b.id) return 1;
  const gap = Math.exp(-Math.abs(a.modifiedDuration - b.modifiedDuration) / 5);
  let c = 0.3 + 0.5 * gap;
  if (a.currency === b.currency) c += 0.1;
  if (a.sector === b.sector) c += 0.05;
  return Math.min(c, 0.97);
}

/**
 * Build the optimizer inputs (μ, Σ) from the portfolio. Expected returns are
 * bond yields (engine), per-asset volatility is `modifiedDuration × yieldVol`,
 * and correlations decay with the maturity gap (a standard FI risk model). No
 * pricing math is duplicated — yields/durations come from the financial engine
 * (via the Risk book).
 */
export function useOptimizationInputs(): OptimizationInputs {
  const { instruments, loading } = useRiskBook();

  return useMemo(() => {
    const assets: OptAsset[] = instruments.map((i) => ({
      id: i.risk.id,
      label: i.risk.label,
      yield: i.risk.yield,
      modifiedDuration: i.risk.modifiedDuration,
      convexity: i.risk.convexity,
      marketValue: i.risk.marketValue,
      dv01PerMv: i.risk.marketValue === 0 ? 0 : i.risk.dv01 / i.risk.marketValue,
      currency: i.risk.currency,
      sector: i.risk.sector,
    }));
    console.log(assets);
    console.log(instruments);
    const mu = assets.map((a) => a.yield);
    const vols = assets.map((a) => a.modifiedDuration * YIELD_VOL_ANNUAL);
    const corr = assets.map((a) => assets.map((b) => correlation(a, b)));
    
    console.log("assets", assets);
    console.log("vols", vols);
    console.log("corr", corr);

    const Sigma = covFromVolCorr(vols, corr);
    const totalMarketValue = assets.reduce((s, a) => s + a.marketValue, 0);
    const currentWeights = assets.map((a) => (totalMarketValue === 0 ? 0 : a.marketValue / totalMarketValue));
    return { assets, mu, Sigma, corr, currentWeights, totalMarketValue, loading };
  }, [instruments, loading]);
}
