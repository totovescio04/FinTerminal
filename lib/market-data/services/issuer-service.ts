import { marketDataRepository } from "./core";

/** Issuer reference data. */
export const issuerService = {
  getIssuer: (issuerId: string) => marketDataRepository.getIssuer(issuerId),
};
