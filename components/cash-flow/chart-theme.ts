/**
 * @file chart-theme.ts
 * Theme-aware color tokens for Recharts. Values reference the same CSS custom
 * properties as the rest of the design system, so charts follow light/dark mode.
 */

export const CHART = {
  primary: "hsl(var(--primary))",
  positive: "hsl(var(--positive))",
  negative: "hsl(var(--negative))",
  accent: "hsl(217 91% 60%)",
  amber: "hsl(38 92% 50%)",
  violet: "hsl(262 83% 62%)",
  grid: "hsl(var(--border))",
  axis: "hsl(var(--muted-foreground))",
  surface: "hsl(var(--card))",
} as const;
