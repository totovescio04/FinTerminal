import { marketDataRepository } from "./core";

/** Benchmark levels (UST points, sovereign, corporate indices). */
export const benchmarkService = {
  getBenchmark: (benchmarkId: string) => marketDataRepository.getBenchmark(benchmarkId),
};
