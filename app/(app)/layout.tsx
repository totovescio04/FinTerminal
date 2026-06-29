import { AppShell } from "@/components/layout/app-shell";

/**
 * Layout for all authenticated/application routes.
 * Provides the persistent sidebar + topbar chrome around page content.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
