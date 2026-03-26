# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server (Vite HMR)
npm run build        # type-check + production build (tsc -b && vite build)
npm run lint         # ESLint with auto-fix
npm run format       # Prettier write on src/**
npm run preview      # preview production build locally
npm test             # run all tests (vitest run)
npm run test:coverage  # coverage table in console
```

Run a single test file:

```bash
npx vitest run src/__tests__/helpers/degreesToWindDirection.test.ts
```

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
- **`src/helpers/`** — pure transformation functions (e.g. `degreesToWindDirection`, `getCurrentPosition`).
- **`src/hooks/`** — custom React hooks (e.g. `useSearchHistory` persists up to 10 cities in `localStorage` under the key `weather-search-history`).
- **`src/components/`** — presentational components that receive typed props; no data fetching.
- **`src/App.tsx`** — root component; owns all state, drives data fetching, handles geolocation with London fallback, composes components.

On initial load `App` tries geolocation → `fetchWeatherByCoords`; on failure it falls back to `fetchCurrentWeather('London')`. Manual searches go through `handleCitySearch`, which also calls `addCity` to persist history.

Styling uses **Tailwind CSS v4** (configured via `@tailwindcss/vite` Vite plugin — no `tailwind.config.*` file needed).

### Known typo in shared type

`WeatherData.windDerection` (misspelled — missing an 'i') is intentionally preserved as-is across `types/weather.ts`, `weatherApi.ts`, and all components/tests. Do not rename it without updating every usage.

## Testing

Vitest v4 + `@testing-library/react` + `@testing-library/jest-dom` + jsdom.

- Test files live in `src/__tests__/` mirroring the `src/` structure.
- `globals: true` in `vite.config.ts` — `describe`/`it`/`expect`/`vi` are global (no imports needed).
- Setup file: `src/__tests__/setup.ts` (imports jest-dom matchers).
- Shared mock fixture: `src/__tests__/__mocks__/weatherData.ts`.
- ESLint return-type rules are disabled for test files.

Common mocking patterns:

```ts
// fetch
vi.stubGlobal('fetch', vi.fn());
afterEach(() => vi.unstubAllGlobals());

// geolocation
Object.defineProperty(navigator, 'geolocation', { value: { ... }, configurable: true });

// env vars (captured at module init — must use dynamic import)
beforeEach(async () => {
  vi.resetModules();
  vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'test-key');
  const mod = await import('../../api/weatherApi');
  // use mod.fetchCurrentWeather
});
```

## Commits

Conventional commits are enforced via commitlint. Format: `type(scope): message`
Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

Pre-commit hook runs `lint-staged` (ESLint --fix + Prettier on `src/**/*.{ts,tsx}`, Prettier on `src/**/*.{css,json}`).
