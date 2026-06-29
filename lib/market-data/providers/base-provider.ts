/**
 * @file base-provider.ts
 * Abstract base for providers. Concrete providers declare their id/name/
 * capabilities and implement only the methods they support.
 */

import type { MarketDataProvider } from "@/lib/market-data/interfaces";
import type { ProviderCapability, ProviderId } from "@/lib/market-data/types";

export abstract class BaseMarketDataProvider implements MarketDataProvider {
  abstract readonly id: ProviderId;
  abstract readonly name: string;
  abstract readonly capabilities: ProviderCapability[];

  /** Default: available. Vendor stubs override to reflect configuration. */
  async isAvailable(): Promise<boolean> {
    return true;
  }

  /** Helper for unimplemented vendor endpoints. */
  protected notImplemented(method: string): never {
    throw new Error(`${this.id}: ${method} not implemented`);
  }
}
