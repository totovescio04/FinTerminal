import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Min-height for the plotting area. */
  bodyClassName?: string;
}

/**
 * Standard container for charts. The chart itself (Recharts) is injected as
 * children, keeping this wrapper presentation-only and reusable.
 */
export function ChartCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: ChartCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent className={cn("flex-1", bodyClassName)}>{children}</CardContent>
    </Card>
  );
}
