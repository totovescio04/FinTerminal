# Bond Data Architecture (Repository Pattern)

A fully decoupled data layer so the bond universe can move from bundled JSON to
a real API without touching a single component.

```
React components
      │  (only ever call the service)
      ▼
BondService            lib/services/bond-service.ts   ← facade + engine screening
      │
      ▼
BondRepository         lib/repositories/bond-repository.ts   ← domain API + cache
      │
      ├── BondDataProvider (interface)   lib/providers/bond-provider.ts
      │      ├── JsonBondProvider   (bundled lib/data/bonds.json)   ← current
      │      └── ApiBondProvider    (REST stub)                     ← future
      │
      └── BondMapper (DataMapper)   lib/mappers/bond-mapper.ts
             DTO → BondRecord (domain) → engine Bond (instrument)
```

## Layers

- **Provider** — the raw source. Implements `BondDataProvider.fetchAll()`
  returning `BondDTO[]`. Today it reads `bonds.json`; tomorrow it calls an API.
- **Mapper (DataMapper)** — narrows loose DTOs into the typed `BondRecord`
  domain model and builds the engine instrument (`createBond`). The only place
  that knows source-specific shapes.
- **Repository** — caches mapped domain records and exposes `getAll/getById/
  search`. Components never see DTOs or JSON.
- **Service** — the single API components use. Adds engine analytics
  (`durationMetrics` at the market yield) for screening, plus filtering & facets.

## Replacing JSON with a real API (Bloomberg / Refinitiv / local market)

1. Implement a provider against your source:
   ```ts
   export class BloombergBondProvider implements BondDataProvider {
     async fetchAll(): Promise<BondDTO[]> {
       const data = await bloombergClient.reference(/* ... */);
       return data.map(toBondDTO); // adapt vendor shape → BondDTO
     }
   }
   ```
2. Wire it into the singleton — **the only line that changes**:
   ```ts
   export const bondService = new BondService(
     new BondRepository(new BloombergBondProvider()),
   );
   ```
3. If the vendor field names differ, extend `BondMapper.toDomain` (or add a
   vendor-specific mapper). Components, hooks, table, filters and detail page
   stay untouched because they depend on `BondRecord`, not the source.

The same pattern hosts a real-time market-data feed: a provider that streams
quotes updates `marketYield`/`marketPrice`, and every screen/derived metric
refreshes through the engine automatically.
