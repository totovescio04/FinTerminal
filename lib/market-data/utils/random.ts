/**
 * @file random.ts
 * Deterministic, seeded helpers so mock data is realistic and reproducible —
 * never "completely random".
 */

/** Mulberry32 PRNG — deterministic for a given seed. */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hash a string to a stable 32-bit seed. */
export function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Build a coherent mean-reverting series (e.g. a price/yield path): a smooth
 * trend plus small seeded noise — not white noise.
 */
export function coherentSeries(
  seed: number,
  length: number,
  start: number,
  driftPerStep: number,
  volatility: number,
): number[] {
  const rnd = seededRandom(seed);
  const out: number[] = [];
  let level = start;
  for (let i = 0; i < length; i++) {
    const shock = (rnd() - 0.5) * 2 * volatility;
    const meanPull = (start - level) * 0.02;
    level = level + driftPerStep + meanPull + shock;
    out.push(level);
  }
  return out;
}

/** ISO date `daysAgo` before a reference date. */
export function isoDaysAgo(reference: string, daysAgo: number): string {
  const d = new Date(reference);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}
