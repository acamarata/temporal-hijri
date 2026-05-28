# temporal-hijri — PRI (Per-Repo Instructions)

**PPI:** `~/Sites/acamarata/.claude/CLAUDE.md`

## What This Is

Temporal Calendar Protocol implementation for the Hijri calendar. Works with the TC39
Temporal proposal and `@js-temporal/polyfill`. Provides `UaqCalendar` (Umm al-Qura) and
`FcnaCalendar` (FCNA/ISNA) as plug-in calendars for `Temporal.PlainDate` and related
types. The underlying conversion logic comes from hijri-core.

**npm:** `temporal-hijri@1.0.0`
**Language:** TypeScript
**License:** MIT

## Key Technical Details

- Peer dependencies: `hijri-core@^1.0.0`, `@js-temporal/polyfill@^0.4.0` (optional)
- `@js-temporal/polyfill` is optional — works with native Temporal when available in the runtime
- Key exports: `uaqCalendar` (singleton), `fcnaCalendar` (singleton), `UaqCalendar` class, `FcnaCalendar` class
- Calendar protocol methods: `year()`, `month()`, `day()`, `monthCode()`, `inLeapYear()`, `dateFromFields()`, `dateAdd()`
- UAQ data covers 1318-1500 AH (Gregorian 1900-2076)
- Dual CJS/ESM build via tsup
- Zero runtime dependencies (peer deps are provided by the consumer)

## Architecture

`src/index.ts` exports calendar singletons and classes. Built to `dist/` (gitignored)
with `.cjs` and `.mjs` outputs plus dual type declarations. No format string parsing —
the Temporal API handles all date arithmetic and formatting natively.

## Commands

- `pnpm install` — install dev deps
- `pnpm build` — tsup build
- `pnpm test` — run test.mjs + test-cjs.cjs
- `pnpm run typecheck` — tsc --noEmit

## Important Notes

- This implements the Temporal Calendar Protocol — it is not a general-purpose Hijri utility
- hijri-core provides the actual calendar engine — this package is a thin Temporal protocol adapter
- Changes to hijri-core's API may require updates here
- `@js-temporal/polyfill` is optional — only needed in environments without native Temporal support
- TC39 Temporal proposal is Stage 3 — API may shift; track spec changes carefully
