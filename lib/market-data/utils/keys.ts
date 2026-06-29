/** Build a stable cache key from parts. */
export function cacheKey(...parts: (string | number)[]): string {
  return parts.map((p) => String(p)).join(":");
}
