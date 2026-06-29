export const OPT = {
  frontier: "hsl(var(--primary))",
  minVar: "hsl(142 64% 40%)",
  maxSharpe: "hsl(38 92% 50%)",
  current: "hsl(0 72% 55%)",
  cloud: "hsl(217 91% 60%)",
  grid: "hsl(var(--border))",
  axis: "hsl(var(--muted-foreground))",
} as const;
export const ALLOC_PALETTE = [
  "hsl(217 91% 60%)", "hsl(142 64% 40%)", "hsl(38 92% 50%)", "hsl(262 83% 62%)",
  "hsl(330 81% 60%)", "hsl(199 89% 48%)", "hsl(24 95% 53%)", "hsl(160 84% 39%)",
];
export const allocColor = (i: number) => ALLOC_PALETTE[i % ALLOC_PALETTE.length]!;
