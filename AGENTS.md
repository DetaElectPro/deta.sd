# AGENTS.md

Vite + React 18 + TypeScript + shadcn-ui + Tailwind + Supabase. Bilingual (Arabic-default, RTL) company/export site for Deta Group.

## Commands

- `npm run dev` — dev server on port 8080 (`vite.config.ts` sets `host: "::"`).
- `npm run build` — production build (`vite build` only, **no `tsc`**). `npm run build:dev` for development-mode build.
- `npm run lint` — `eslint .` (unused-vars rule is off; `dist/` ignored).
- `npm run preview` — preview built output.
- Typecheck (no script): `npx tsc --noEmit -p tsconfig.app.json`.
- No test runner configured — no unit/integration suites; verify via build + lint + manual check.
- CI (`/.github/workflows/deploy.yml`) installs/builds with **bun** (`bun install`, `bun run build` on Node 20), so keep `bun.lockb` and `package-lock.json` in sync if you change deps.

## Env / Supabase

- Required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (see `.env.example`; `.env*` gitignored). CI injects them from `SUPABASE_URL` / `SUPABASE_ANON_KEY` secrets.
- Project id `dnnhupnkzbixkgqgcrnc` (`supabase/config.toml`). SQL in `supabase/migrations/` + root `supabase_complete_migration.sql`; edge function in `supabase/functions/send-order-confirmation/`. On a fresh project run `supabase/migrations/0_bootstrap_schema.sql` FIRST (rebuilds all 21 tables + RLS + seed from `types.ts`), then the other SQL files in order.
- `src/integrations/supabase/client.ts` is auto-generated — **do not edit**; import via `import { supabase } from "@/integrations/supabase/client"`. DB types live in `src/integrations/supabase/types.ts`.

## Architecture

- Entrypoint: `src/main.tsx` (HelmetProvider) → `src/App.tsx`. Providers: QueryClient → AuthProvider (`hooks/useAuth`) → LanguageProvider (`hooks/useLanguage`) → TooltipProvider.
- Routes are declared in `src/App.tsx`; `/admin/*` is wrapped in `ProtectedRoute`. SPA fallback on Pages is handled by CI copying `dist/index.html` → `dist/404.html` — keep that step if routing changes.
- Data: page components in `src/pages/`, per-entity fetch/mutation hooks in `src/hooks/use*.tsx` (react-query + supabase), forms with react-hook-form + zod (`src/lib/validationSchemas.ts`). Shared UI in `src/components/` (`ui/` = shadcn, `admin/` = admin panels).
- Path alias `@` → `src/` (set in `vite.config.ts`, `tsconfig.json`, `components.json`). shadcn style: `default`, base `slate`, CSS variables on.

## Conventions / gotchas

- **RTL-first**: default lang `ar`, `index.html` is `lang="ar" dir="rtl"`. `useLanguage` persists `localStorage.language` and flips `document.dir`/`documentElement.lang`. Static ar/en strings live in the `translations` dict in `src/hooks/useLanguage.tsx`; some content also comes from Supabase (`languages`, `useMultilingual*`). Test layout changes in both directions.
- **Brand tokens**: `deta.{green,green-light,gold,gold-light,brown,brown-light}` + `font-cairo`/`font-amiri` in `tailwind.config.ts`; use `cn()` from `src/lib/utils.ts` for classes.
- **`vite.config.ts` `base` is currently `'/'`** for local dev/test. When publishing to GitHub Pages as a project site, restore `base: '/deta.sd/'` (custom domain via `CNAME` = `deta.sd`) and verify asset paths after deploy. `lovable-tagger` runs in development mode only.
- **`index.html` has a strict CSP** (`connect-src` allowlists supabase + a few APIs, `script-src` allowlists `cdn.gpteng.co`). New external endpoints/scripts require a CSP update. Do not remove the `gptengineer.js` script tag / comment.
- `tsconfig` is relaxed (`noImplicitAny`/`strictNullChecks`/`noUnusedLocals` off) — build won't catch type errors, so run the manual `tsc --noEmit` above before finishing.
- `README.md` is Lovable boilerplate; not a source of truth. Trust `package.json`, `vite.config.ts`, `deploy.yml`, and `index.html`.
