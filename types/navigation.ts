import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Marks routes whose feature work lands in a later stage. */
  comingSoon?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
