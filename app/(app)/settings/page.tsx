import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Separator } from "@/components/ui/separator";
import { AppearanceSettings } from "./components/appearance-settings";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Settings" description="Manage your workspace preferences." />

      <SectionCard
        title="Appearance"
        description="Choose how FinTerminal looks. Your choice is saved to this device."
      >
        <AppearanceSettings />
      </SectionCard>

      <SectionCard
        title="Workspace"
        description="General workspace configuration."
      >
        <dl className="divide-y divide-border text-sm">
          <div className="flex items-center justify-between py-3">
            <dt className="text-muted-foreground">Default module</dt>
            <dd className="font-medium">Dashboard</dd>
          </div>
          <Separator className="hidden" />
          <div className="flex items-center justify-between py-3">
            <dt className="text-muted-foreground">Base currency</dt>
            <dd className="font-medium">USD</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-muted-foreground">Analytics engine</dt>
            <dd className="font-medium text-muted-foreground">Stage 2 — not connected</dd>
          </div>
        </dl>
      </SectionCard>
    </div>
  );
}
