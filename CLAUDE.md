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

## Commits

Conventional commits are enforced via commitlint. Format: `type(scope): message`
Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

Pre-commit hook runs `lint-staged` (ESLint --fix + Prettier on `src/**/*.{ts,tsx}`, Prettier on `src/**/*.{css,json}`).
