/**
 * @file bond-provider.ts
 * Data providers (the low-level source). All providers implement
 * {@link BondDataProvider}, so swapping the bundled JSON for a REST API,
 * Bloomberg or Refinitiv only means adding a new provider class.
 */

import type { BondDTO } from "@/lib/data/bond-dto";
import bonds from "@/lib/data/bonds.json";

/** Contract every data source must satisfy. */
export interface BondDataProvider {
  fetchAll(): Promise<BondDTO[]>;
  fetchById?(id: string): Promise<BondDTO | null>;
}

/** Default provider backed by the bundled JSON seed. */
export class JsonBondProvider implements BondDataProvider {
  async fetchAll(): Promise<BondDTO[]> {
    // Single cast at the data boundary; everything downstream is fully typed.
    return bonds as unknown as BondDTO[];
  }
}

/**
 * Stub for a future REST API provider. Implement `fetchAll` against your
 * endpoint and inject it into the repository — no component changes required.
 */
export class ApiBondProvider implements BondDataProvider {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetchAll(): Promise<BondDTO[]> {
    const res = await fetch(`${this.baseUrl}/bonds`);
    if (!res.ok) throw new Error(`Bond API error: ${res.status}`);
    return (await res.json()) as BondDTO[];
  }
}
