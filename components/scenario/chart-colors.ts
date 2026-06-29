/** Theme-aware Recharts colors for the scenario module (CSS-variable backed). */
export const SC_COLORS = {
  primary: "hsl(var(--primary))",
  positive: "hsl(var(--positive))",
  negative: "hsl(var(--negative))",
  amber: "hsl(38 92% 50%)",
  accent: "hsl(217 91% 60%)",
  violet: "hsl(262 83% 62%)",
  grid: "hsl(var(--border))",
  axis: "hsl(var(--muted-foreground))",
} as const;
