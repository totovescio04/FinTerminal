import type { LucideIcon } from "lucide-react";
import { Rocket } from "lucide-react";
import { PageHeader } from "./page-header";
import { SectionCard } from "./section-card";
import { Badge } from "@/components/ui/badge";

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  /** Capabilities planned for this module in Stage 2. */
  features?: string[];
}

/**
 * Standard placeholder page for modules whose feature work lands in Stage 2.
 * Keeps every route navigable with a consistent, professional empty shell.
 */
export function ComingSoon({ title, description, icon: Icon = Rocket, features = [] }: ComingSoonProps) {
  return (
    <div className="space-y-8">
      <PageHeader
        title={title}
        description={description}
        actions={<Badge variant="muted">Coming in Stage 2</Badge>}
      />

      <SectionCard>
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <Icon className="h-6 w-6" />
          </span>
          <div className="space-y-1">
            <p className="text-base font-semibold">Module scaffolded</p>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              The layout and routing for this section are ready. Analytics will be wired to the
              fixed-income engine in the next stage.
            </p>
          </div>

          {features.length > 0 && (
            <ul className="mx-auto grid max-w-lg grid-cols-1 gap-2 pt-2 text-left sm:grid-cols-2">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
