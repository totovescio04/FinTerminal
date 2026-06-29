import {
  LayoutDashboard,
  Landmark,
  Table2,
  Database,
  Activity,
  Briefcase,
  ShieldAlert,
  Sparkles,
  LineChart,
  FlaskConical,
  GitCompareArrows,
  Settings,
} from "lucide-react";
import type { NavItem } from "@/types/navigation";

/** Primary sidebar navigation. Order here defines visual order. */
export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Fixed Income", href: "/fixed-income", icon: Landmark },
  { title: "Cash Flow Viewer", href: "/cash-flows", icon: Table2 },
  { title: "Bond Database", href: "/bonds", icon: Database },
  { title: "Market Data", href: "/market", icon: Activity },
  { title: "Portfolio", href: "/portfolio", icon: Briefcase },
  { title: "Risk Dashboard", href: "/risk", icon: ShieldAlert },
  { title: "Portfolio Optimizer", href: "/optimizer", icon: Sparkles },
  { title: "Yield Curve", href: "/yield-curve", icon: LineChart },
  { title: "Scenario Analysis", href: "/scenario-analysis", icon: FlaskConical },
  { title: "Bond Comparator", href: "/comparator", icon: GitCompareArrows },
  { title: "Settings", href: "/settings", icon: Settings },
];

/** Human-readable labels for breadcrumb generation, keyed by path segment. */
export const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  "fixed-income": "Fixed Income",
  "cash-flows": "Cash Flow Viewer",
  bonds: "Bond Database",
  market: "Market Data",
  portfolio: "Portfolio",
  risk: "Risk Dashboard",
  optimizer: "Portfolio Optimizer",
  "yield-curve": "Yield Curve",
  "scenario-analysis": "Scenario Analysis",
  comparator: "Bond Comparator",
  settings: "Settings",
};
