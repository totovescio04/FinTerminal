import { marketDataRepository } from "./core";

/** Aggregate snapshot + provider health. */
export const marketService = {
  getSnapshot: () => marketDataRepository.getSnapshot(),
  getProviderStatuses: () => marketDataRepository.getProviderStatuses(),
  clearCache: () => marketDataRepository.clearCache(),
};
