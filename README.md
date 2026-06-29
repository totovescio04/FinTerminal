# FinTerminal

Professional fixed-income analytics platform — **Stage 1: foundation**.

A premium, SaaS-style workspace (think Linear / Vercel / Stripe) for fixed-income
analysis, built to scale toward equities, derivatives, portfolio management and
corporate finance.

> **Stage 1 scope:** architecture, design system, navigation, layout, reusable
> components, empty pages, a visual dashboard, and light/dark theming.
> **No financial logic is implemented yet** — that lands in Stage 2 inside
> `lib/fixed-income/`.

## Tech stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS ·
shadcn/ui (Radix) · React Hook Form · Zod · TanStack Table · Recharts ·
date-fns · Framer Motion · Lucide React · ESLint · Prettier.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000  → redirects to /dashboard
```

Other scripts:

```bash
npm run build        # production build
npm run lint         # eslint
npm run typecheck    # tsc --noEmit (strict)
npm run format       # prettier --write
```

## Project structure

```
app/
  (app)/                 # route group: shares the sidebar + topbar shell
    dashboard/           # visual dashboard (KPIs + reserved sections)
    fixed-income/        # module placeholders (Stage 2)
    portfolio/
    yield-curve/
    scenario-analysis/
    comparator/
    settings/            # working light/dark/system theme switch
    layout.tsx           # wraps routes in <AppShell/>
  layout.tsx             # root: fonts, ThemeProvider, no-flash theme script
  page.tsx               # redirects → /dashboard
  not-found.tsx
  globals.css            # design tokens (CSS variables) for light + dark

components/
  ui/                    # shadcn/Radix primitives (button, card, ...)
  layout/                # AppShell, Sidebar, Topbar, Breadcrumb, theme toggle
  dashboard/             # KpiCard, MetricCard, KpiGrid
  charts/                # ChartCard, ChartPlaceholder
  tables/                # generic DataTable (TanStack)
  forms/                 # (Stage 2)
  fixed-income/          # (Stage 2)
  shared/                # PageHeader, SectionCard, SectionTitle, states, ComingSoon

lib/
  fixed-income/          # reserved — the analytics engine lives here (Stage 2)
  utils/                 # cn(), formatters, trend helpers

hooks/                   # useTheme, useMounted, useBreadcrumbs
types/                   # navigation, metrics, theme, fixed-income contracts
constants/               # app meta, navigation, theme, mock dashboard data
providers/               # ThemeProvider (context + persistence)
styles/  public/
```

See `ARCHITECTURE.md` for the rationale behind these choices.
