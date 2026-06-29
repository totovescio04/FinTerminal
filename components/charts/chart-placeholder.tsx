import { type LucideIcon, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartPlaceholderProps {
  label?: string;
  icon?: LucideIcon;
  className?: string;
  height?: number;
}

/**
 * Visual stand-in for a chart that will be wired to Recharts + the analytics
 * engine in Stage 2. Renders a subtle gridded area so layouts read correctly.
 */
export function ChartPlaceholder({
  label = "Visualization reserved for Stage 2",
  icon: Icon = BarChart3,
  className,
  height = 240,
}: ChartPlaceholderProps) {
  return (
    <div
      style={{ height }}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:24px_24px] text-muted-foreground",
        className,
      )}
    >
      <Icon className="h-6 w-6 opacity-70" />
      <p className="text-xs">{label}</p>
    </div>
  );
}
