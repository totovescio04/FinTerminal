# FinTerminal — Architecture

This document explains the architecture chosen for Stage 1 and why it is a solid
base for a professional financial platform that will grow to cover equities,
derivatives, portfolio management and corporate finance.

## 1. Guiding principles

1. **Separation of concerns** — UI, domain logic and data contracts live in
   distinct layers. The UI never owns financial math; the math never owns React.
2. **Type-driven development** — strict TypeScript and shared domain types make
   the contract between the (future) engine and the UI explicit and safe.
3. **Feature-oriented, scalable folders** — every domain (fixed income,
   portfolio, etc.) has a predictable home, so adding modules is additive, not
   invasive.
4. **Design-system first** — a single source of truth for color, spacing,
   radius and typography via CSS variables + Tailwind tokens, themeable at runtime.
5. **Composability** — small, single-responsibility components combined into
   pages, in the spirit of SOLID.

## 2. Layered architecture

```
┌─────────────────────────────────────────────────────────┐
│  app/            Routing, layouts, page composition       │  presentation
├─────────────────────────────────────────────────────────┤
│  components/     Reusable UI (ui → shared → feature)      │  presentation
├─────────────────────────────────────────────────────────┤
│  hooks/ providers/  Cross-cutting React behavior          │  application
├─────────────────────────────────────────────────────────┤
│  lib/            Pure logic: utils now, engine in Stage 2 │  domain
├─────────────────────────────────────────────────────────┤
│  types/ constants/  Contracts & static config            │  shared kernel
└─────────────────────────────────────────────────────────┘
```

The key boundary: **`lib/fixed-income/` is a pure domain layer** — functions in,
numbers out, no React and no I/O. That keeps the engine unit-testable in
isolation and reusable across the dashboard, comparator and scenario tools. The
UI will only ever consume it through the typed contracts in
`types/fixed-income.ts` (`Bond`, `BondAnalytics`, `CashFlow`, `CurvePoint`).

## 3. Routing & the application shell

Routes use the Next.js **App Router**. All authenticated application screens are
grouped under the `app/(app)/` **route group**. A route group:

- shares one layout (`(app)/layout.tsx` → `<AppShell/>` with the persistent
  sidebar + topbar) across every page **without adding a segment to the URL**
  (so the path stays `/dashboard`, not `/app/dashboard`), and
- keeps top-level concerns (the root `layout.tsx`, the `/` redirect, and a
  full-screen `not-found.tsx`) cleanly **outside** the shell.

This is the idiomatic way to separate "chrome-wrapped app pages" from
"standalone pages" (e.g. a future `(auth)/login`) and scales naturally as new
sections are added.

`AppShell` composes three independent pieces — `Sidebar`, `Topbar`, and the
scrollable `<main>` — so each can evolve without touching the others.

## 4. Component taxonomy

Components are organized by **level of abstraction**, lowest to highest:

- **`components/ui/`** — design-system primitives (shadcn/ui on Radix):
  `button`, `card`, `input`, `avatar`, `dropdown-menu`, `tooltip`, `sheet`,
  `table`, `badge`, `skeleton`, `separator`, `label`. These know nothing about
  finance; they are the vocabulary everything else is written in.
- **`components/shared/`** — app-level building blocks reused across pages:
  `PageHeader`, `SectionCard`, `SectionTitle`, `LoadingState`, `EmptyState`,
  `ErrorState`, `ComingSoon`.
- **`components/layout/`** — the chrome: `AppShell`, `Sidebar`, `Topbar`,
  `Breadcrumb`, `Logo`, `ThemeToggle`, `UserMenu`, search and nav links.
- **`components/dashboard|charts|tables/`** — feature components: `KpiCard`,
  `MetricCard`, `ChartCard`, `ChartPlaceholder`, and a generic `DataTable`.

Each folder exposes a barrel `index.ts` for clean imports. Components are small
and props-driven — e.g. `KpiCard` renders any `KpiMetric`, `DataTable<TData>` is
generic over its row type, and `ChartCard` is a pure wrapper that will host
Recharts in Stage 2. This **open/closed** approach means new data plugs into
existing components rather than forcing rewrites.

## 5. Design system & theming

Colors live as **HSL CSS custom properties** in `globals.css`, mapped to
semantic Tailwind tokens in `tailwind.config.ts` (`background`, `foreground`,
`primary`, `muted`, `border`, plus finance-specific `positive` / `negative` and
a dedicated `sidebar` scale). Benefits:

- **One change propagates everywhere** — components reference `bg-primary` /
  `text-positive`, never raw hex, so re-skinning is a token edit.
- **Light & dark are just two variable sets** under `:root` and `.dark`.
- The aesthetic targets a **premium SaaS** feel (white space, soft borders,
  subtle `shadow-card`/`shadow-elevated`, modern Inter type, tabular figures for
  numbers) — deliberately not the classic dark Bloomberg look.

**Theme management** is a small, dependency-free system (no `next-themes`, to
respect the fixed stack):

- `providers/ThemeProvider` holds `light | dark | system`, resolves `system`
  against the OS preference, applies the `.dark` class to `<html>`, and
  **persists the choice to `localStorage`**.
- A tiny **blocking script** (`THEME_INIT_SCRIPT`) runs before paint to set the
  correct theme immediately, preventing a flash of the wrong theme (FOUC).
- `useTheme()` exposes the context; the Settings page and the topbar toggle both
  drive it.

## 6. Types, constants & contracts

- **`types/`** is the shared kernel. `fixed-income.ts` already defines the
  domain vocabulary (`Bond`, `BondAnalytics`, `CashFlow`, `CurvePoint`,
  `DayCountConvention`, `CouponFrequency`) so Stage 2 implements *against a fixed
  contract* instead of inventing shapes ad hoc.
- **`constants/`** centralizes navigation (`NAV_ITEMS` drives both the desktop
  and mobile menus from one array), app metadata, theme keys and the mock
  dashboard data — so there are no magic strings scattered in components.

## 7. Code-quality posture

- **Strict TypeScript** with extra guards (`noUncheckedIndexedAccess`,
  `noImplicitOverride`, `noFallthroughCasesInSwitch`) and an ESLint rule that
  makes **`any` an error** — the codebase contains zero `any`.
- **Prettier** (+ Tailwind class sorting) and **ESLint** (`next/core-web-vitals`
  + `next/typescript`, prettier-compatible) enforce a consistent style.
- `@/*` path alias keeps imports absolute and refactor-safe.

## 8. Why this scales to a full platform

- **New module = new folder, not a rewrite.** Adding *Equities* means an
  `app/(app)/equities/` route, an `equities` component folder, an
  `equities` engine folder under `lib/`, and types under `types/` — all
  following the exact pattern already established for fixed income. Navigation is
  one entry in `NAV_ITEMS`.
- **The engine is swappable and testable.** Because `lib/` is pure and hidden
  behind typed contracts, the analytics can be developed, unit-tested, optimized
  (or even moved to a worker/server) without UI changes.
- **The design system absorbs growth.** Tokens + primitives mean ten new screens
  stay visually consistent for free.
- **Clear seams for data.** `LoadingState` / `EmptyState` / `ErrorState` and the
  generic `DataTable` already model the async lifecycle, so wiring real data is a
  matter of replacing mock constants with fetched data of the same type.

In short, Stage 1 delivers the *skeleton and nervous system* of a professional
financial terminal: strict contracts, a themeable design system, a composable
component library, and a routing/layout shell — everything needed to start
building the fixed-income engine in Stage 2 with no architectural debt.
