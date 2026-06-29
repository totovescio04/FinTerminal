export const RISK_PALETTE = [
  "hsl(217 91% 60%)", "hsl(142 64% 40%)", "hsl(38 92% 50%)", "hsl(262 83% 62%)",
  "hsl(330 81% 60%)", "hsl(199 89% 48%)", "hsl(24 95% 53%)", "hsl(160 84% 39%)",
];
export const paletteColor = (i: number) => RISK_PALETTE[i % RISK_PALETTE.length]!;
export const RISK = {
  primary: "hsl(var(--primary))",
  positive: "hsl(var(--positive))",
  negative: "hsl(var(--negative))",
  grid: "hsl(var(--border))",
  axis: "hsl(var(--muted-foreground))",
} as const;
