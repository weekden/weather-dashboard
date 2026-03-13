# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server (Vite HMR)
npm run build        # type-check + production build (tsc -b && vite build)
npm run lint         # ESLint with auto-fix
npm run format       # Prettier write on src/**
npm run preview      # preview production build locally
```

No test runner is configured yet.

## TypeScript

Strict mode is fully enabled with additional flags: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`. Array index access returns `T | undefined` — always guard before use.

Use `type` imports for type-only symbols (`import type { Foo } from './foo'`) — `@typescript-eslint/consistent-type-imports` is enforced as an error.

## React Components

Return type must be `React.JSX.Element` (not `JSX.Element` — global JSX namespace is unavailable in `@types/react` 18+).

## ESLint Rules (enforced as errors)

- `@typescript-eslint/explicit-function-return-type` — all functions need return types
- `@typescript-eslint/explicit-module-boundary-types` — exported functions need explicit types
- `@typescript-eslint/no-explicit-any` — no `any`
- `simple-import-sort/imports` + `simple-import-sort/exports` — imports must be sorted

## Environment

Requires a `.env` file at the project root:

```
VITE_OPENWEATHER_API_KEY=<your_key>
```

See `.env.example` for reference. The key is read in `src/api/weatherApi.ts` via `import.meta.env.VITE_OPENWEATHER_API_KEY`.

## Architecture

Data flows in one direction: `api/` → `types/` ← `components/`

- **`src/api/weatherApi.ts`** — fetches from OpenWeatherMap `/data/2.5/weather`, maps the raw JSON to `WeatherData`, throws typed errors on 404 and other failures.
- **`src/types/weather.ts`** — single `WeatherData` interface shared by the API layer and all components.
- **`src/helpers/`** — pure transformation functions (e.g. `degreesToWindDirection`).
- **`src/components/`** — presentational components that receive typed props; no data fetching.
- **`src/App.tsx`** — root component; owns state, drives data fetching, composes components.

Styling uses **Tailwind CSS v4** (configured via `@tailwindcss/vite` Vite plugin — no `tailwind.config.*` file needed).

## Commits

Conventional commits are enforced via commitlint. Format: `type(scope): message`
Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

Pre-commit hook runs `lint-staged` (ESLint --fix + Prettier on `src/**/*.{ts,tsx}`, Prettier on `src/**/*.{css,json}`).
