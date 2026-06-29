import type { Metadata } from "next";
import {
  Activity,
  CalendarClock,
  Gauge,
  LineChart,
  PieChart,
  ShieldCheck,
  Waves,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { MetricCard } from "@/components/dashboard/metric-card";
import { SectionCard } from "@/components/shared/section-card";
import { ChartCard } from "@/components/charts/chart-card";
import { ChartPlaceholder } from "@/components/charts/chart-placeholder";
import { LoadingState } from "@/components/shared/loading-state";
import { Badge } from "@/components/ui/badge";
import { DASHBOARD_KPIS } from "@/constants/mock-dashboard";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Portfolio overview and risk analytics at a glance."
        actions={<Badge variant="muted">Demo data</Badge>}
      />

      {/* KPI overview */}
      <KpiGrid metrics={DASHBOARD_KPIS} />

      {/* Charts row — reserved for Stage 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Yield Curve"
          description="Spot & forward term structure"
          className="lg:col-span-2"
          action={<Badge variant="muted">Reserved</Badge>}
        >
          <ChartPlaceholder icon={LineChart} height={260} />
        </ChartCard>

        <ChartCard
          title="Portfolio Allocation"
          description="By sector & rating"
          action={<Badge variant="muted">Reserved</Badge>}
        >
          <ChartPlaceholder icon={PieChart} height={260} label="Allocation breakdown — Stage 2" />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Cash Flows"
          description="Projected coupons & principal"
          className="lg:col-span-2"
          action={<Badge variant="muted">Reserved</Badge>}
        >
          <ChartPlaceholder icon={Waves} height={240} label="Cash-flow schedule — Stage 2" />
        </ChartCard>

        {/* Risk metrics — placeholder metric cards */}
        <SectionCard title="Risk Metrics" description="Portfolio-level sensitivities">
          <div className="grid grid-cols-1 gap-3">
            <MetricCard label="Modified Duration" value="5.94" icon={Gauge} hint="per 100bp" />
            <MetricCard label="DV01" value="$7,410" icon={Activity} hint="per 1bp" />
            <MetricCard label="Avg. Rating" value="A+" icon={ShieldCheck} hint="weighted" />
          </div>
        </SectionCard>
      </div>

      {/* Recent activity — skeleton while no engine is connected */}
      <SectionCard
        title="Recent Activity"
        description="Latest trades, repricings and alerts"
        action={
          <Badge variant="muted">
            <CalendarClock className="mr-1 h-3 w-3" />
            Awaiting data
          </Badge>
        }
      >
        <LoadingState rows={4} />
      </SectionCard>
    </div>
  );
}
