/**
 * @file vendor-providers.ts
 * Architecture-only stubs for external vendors. Each declares the capabilities
 * it would expose; all report unavailable until credentials + an adapter are
 * wired in. The repository skips unavailable providers automatically.
 */

import type { ProviderCapability, ProviderId } from "@/lib/market-data/types";
import { BaseMarketDataProvider } from "./base-provider";

abstract class VendorProvider extends BaseMarketDataProvider {
  protected readonly apiKey?: string;
  constructor(apiKey?: string) {
    super();
    this.apiKey = apiKey;
  }
  /** Unavailable until configured with credentials. */
  override async isAvailable(): Promise<boolean> {
    return Boolean(this.apiKey);
  }
}

export class BloombergProvider extends VendorProvider {
  readonly id: ProviderId = "bloomberg";
  readonly name = "Bloomberg";
  readonly capabilities: ProviderCapability[] = ["quote", "curve", "fx", "history", "snapshot", "issuer", "benchmark"];
}

export class RefinitivProvider extends VendorProvider {
  readonly id: ProviderId = "refinitiv";
  readonly name = "Refinitiv";
  readonly capabilities: ProviderCapability[] = ["quote", "curve", "fx", "history", "issuer", "benchmark"];
}

export class MarketAxessProvider extends VendorProvider {
  readonly id: ProviderId = "marketaxess";
  readonly name = "MarketAxess";
  readonly capabilities: ProviderCapability[] = ["quote", "history"];
}

export class OpenFigiProvider extends VendorProvider {
  readonly id: ProviderId = "openfigi";
  readonly name = "OpenFIGI";
  readonly capabilities: ProviderCapability[] = ["issuer"];
}

export class PolygonProvider extends VendorProvider {
  readonly id: ProviderId = "polygon";
  readonly name = "Polygon";
  readonly capabilities: ProviderCapability[] = ["quote", "history"];
}

export class FmpProvider extends VendorProvider {
  readonly id: ProviderId = "fmp";
  readonly name = "Financial Modeling Prep";
  readonly capabilities: ProviderCapability[] = ["quote", "fx", "history", "benchmark"];
}

export class AlphaVantageProvider extends VendorProvider {
  readonly id: ProviderId = "alphavantage";
  readonly name = "Alpha Vantage";
  readonly capabilities: ProviderCapability[] = ["fx", "history"];
}
