import { cn } from "@/lib/utils";

interface MetricGroupProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

/** A titled card wrapping a set of {@link MetricCard}s. */
export function MetricGroup({ title, children, className }: MetricGroupProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card shadow-card", className)}>
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}
