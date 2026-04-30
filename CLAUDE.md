# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Monorepo (pnpm workspaces + Turbo) for a billing/payment management SPA backed by Azure Functions and Cosmos DB.

| Package | Role |
|---------|------|
| `apps/admin` | Quasar (Vue 3 + Pinia + Vue Router) SPA |
| `packages/shared` | Shared types, auth (MSAL), telemetry, pipeline utilities |
| `functions` | Azure Functions v4 REST API (Cosmos DB) |

## Commands

```bash
# Frontend (apps/admin)
pnpm --filter admin dev          # Quasar dev server
pnpm --filter admin build        # Production build
pnpm --filter admin lint         # ESLint + vue-tsc type check

# Backend (functions) — Azure Functions と pnpm の相性が悪いため npm で独立管理
# packages/shared は pnpm workspace 経由で参照できないため
# functions/src/shared -> ../../packages/shared/src のシンボリックリンクで共有
cd functions && npm run dev      # Requires: az login + npx azurite running separately
cd functions && npm run build
cd functions && npm run test     # vitest

# Shared package
pnpm --filter @shisamo/shared test
pnpm --filter @shisamo/shared lint

# From repo root (Turbo)
pnpm build:admin
pnpm lint:admin
```

Type check only (no emit):
```bash
cd apps/admin && npx vue-tsc --noEmit
```

## Architecture

### Frontend (apps/admin)

**Router guards** (`src/router/`): `auth-guard` → `prefetch-guard` → `breadcrumb-guard` run in sequence on navigation. `prefetch-guard` calls `mastersStore.prefetch()` to bulk-load all master data before rendering.

**Authentication**: Public routes opt-out via `meta: { public: true }`. All other routes require MSAL sign-in via `@shisamo/shared`'s `MSAuth`.

**Masters store pattern**: Each master (Tariffs, Charges, Carriers, etc.) uses `createMasterStore<T>(containerName)` from `stores/masters/factory.ts`, which provides `fetchAll / create / update / delete / restore`. The parent `useMastersStore` owns all HTTP calls (`/api/item-list/:container`, `/api/create-item/:container`, `/api/replace-item/:container/:id`, `/api/update-item/:container/:id`).

**Configs**: Static table column definitions and preset data live in `src/configs/masters/` or `src/configs/container-table/`. They use `i18n.global` (not `useI18n()`) since they run outside component setup.

**Models**: Business logic classes (`Tariff`, `Charge`) in `src/models/`. `Charge` exposes `.calculator(code).calculate(value)` where the calculator variant is selected by `ChargeItem.unit` (`count | minutes | yen`).

**i18n**: Japanese only, single file at `src/i18n/ja/index.ts`. All user-visible strings must go here.

**InlineEditPopup component**: `src/components/InlineEditPopup.vue` wraps `QPopupEdit` with save/cancel buttons. Props: `modelValue: string | number`, `type: 'text' | 'textarea' | 'number'`, `disable`. Emits `save(value: string | number)` — type `'number'` converts internally via `Number()`.

### Backend (functions)

Entry point resolves function handlers via glob in `src/index.ts` (required — omitting the glob silently drops all functions on deploy). Routes are defined under `src/routes/`, schemas under `src/schemas/` (Zod), Cosmos DB access via `src/lib/cosmos.ts`.

### Shared package (`packages/shared`)

Exports: `MSAuth` (MSAL wrapper), `AppInsights` (telemetry), all domain types (`CosmosItem`, `ChargeItems`, `ChargeItem`, `TariffsItem`, etc.), pipeline utilities. Consumed by both `apps/admin` and `functions` as `@shisamo/shared`.

## Key Conventions

- **Optimistic updates are not used.** UI updates only after API success; `Loading.show/hide` wraps all async store calls.
- **`enabled` flag is one-way.** Once `enabled: true`, an item is read-only. `isActive` can toggle freely but only after `enabled` is set.
- **`QPopupEdit` disable**: Use `@update:model-value` (not `@click`) on `QToggle` so Quasar's `disable` prop actually suppresses the event.
- **Nested array updates** (e.g., `ChargeItem` fields inside `ChargeItems.items`) require a full `update` (replace), not `patch`, since Cosmos DB patch on arrays is complex.
- **JSDoc style**: `@param` and `@returns` tags on all non-trivial functions.
