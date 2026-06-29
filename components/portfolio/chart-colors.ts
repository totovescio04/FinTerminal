/** Theme-aware Recharts colors + a categorical palette for the portfolio. */
export const PF_COLORS = {
  primary: "hsl(var(--primary))",
  positive: "hsl(var(--positive))",
  negative: "hsl(var(--negative))",
  grid: "hsl(var(--border))",
  axis: "hsl(var(--muted-foreground))",
} as const;

/** Categorical palette for allocation slices. */
export const PF_PALETTE: string[] = [
  "hsl(217 91% 60%)",
  "hsl(142 64% 40%)",
  "hsl(38 92% 50%)",
  "hsl(262 83% 62%)",
  "hsl(330 81% 60%)",
  "hsl(199 89% 48%)",
  "hsl(24 95% 53%)",
  "hsl(160 84% 39%)",
];

/** Pick a palette color by index (wraps around). */
export const paletteColor = (i: number): string => PF_PALETTE[i % PF_PALETTE.length]!;
