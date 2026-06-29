"use client";

import { ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  title: string;
  description?: string;
  toolbar?: React.ReactNode;
  /** A single Recharts chart element. */
  children: React.ReactElement;
  height?: number;
  className?: string;
}

/**
 * Standard responsive wrapper for every chart in the module. Provides the card
 * chrome and a {@link ResponsiveContainer} so charts adapt to any breakpoint.
 */
export function ChartContainer({
  title,
  description,
  toolbar,
  children,
  height = 280,
  className,
}: ChartContainerProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {toolbar}
      </CardHeader>
      <CardContent className="pt-2">
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
