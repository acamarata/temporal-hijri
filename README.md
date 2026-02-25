[![npm version](https://img.shields.io/npm/v/temporal-hijri.svg)](https://www.npmjs.com/package/temporal-hijri)
[![CI](https://github.com/acamarata/temporal-hijri/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/temporal-hijri/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

# temporal-hijri

Temporal Calendar Protocol implementation for the Hijri calendar. Works with the TC39 Temporal proposal and `@js-temporal/polyfill`.

Provides `UaqCalendar` (Umm al-Qura) and `FcnaCalendar` (FCNA/ISNA) as plug-in calendars for `Temporal.PlainDate` and related types. The underlying conversion logic comes from [hijri-core](https://github.com/acamarata/hijri-core), a zero-dependency Hijri engine with table-driven UAQ data and astronomical FCNA calculations.

---

## Installation

```bash
pnpm add temporal-hijri hijri-core
```

If you are using the polyfill instead of the native `Temporal` API:

```bash
pnpm add temporal-hijri hijri-core @js-temporal/polyfill
```

---

## Quick Start

```typescript
import { Temporal } from '@js-temporal/polyfill'; // or use native Temporal
import { uaqCalendar } from 'temporal-hijri';

// Convert an ISO date to Hijri coordinates
const isoDate = Temporal.PlainDate.from('2023-03-23');

console.log(uaqCalendar.year(isoDate));      // 1444
console.log(uaqCalendar.month(isoDate));     // 9  (Ramadan)
console.log(uaqCalendar.day(isoDate));       // 1
console.log(uaqCalendar.monthCode(isoDate)); // "M09"
console.log(uaqCalendar.inLeapYear(isoDate)); // false (1444 is 354 days)

// Convert Hijri coordinates back to ISO
const ramadan = uaqCalendar.dateFromFields({ year: 1444, month: 9, day: 1 });
console.log(ramadan.toString()); // "2023-03-23"

// Arithmetic in Hijri space
const { Duration } = Temporal;
const nextMonth = uaqCalendar.dateAdd(isoDate, new Duration(0, 1));
console.log(uaqCalendar.month(nextMonth)); // 10 (Shawwal)
console.log(nextMonth.toString());          // "2023-04-21"
```

---

## Calendar Classes

### `UaqCalendar`

Implements the Umm al-Qura calendar, the official calendar of Saudi Arabia. Month boundaries come from pre-calculated tables covering 1318-1500 AH (Gregorian 1900-2076). The most widely used Hijri calendar standard for civil and religious purposes.

```typescript
import { UaqCalendar } from 'temporal-hijri';
const cal = new UaqCalendar(); // cal.id === 'hijri-uaq'
```

### `FcnaCalendar`

Implements the FCNA/ISNA calendar used by the Fiqh Council of North America and the Islamic Society of North America. Month starts are determined by astronomical new moon calculation (Meeus Chapter 49): if conjunction occurs before 12:00 UTC, the month begins the next day; if at or after noon, it begins the day after that.

```typescript
import { FcnaCalendar } from 'temporal-hijri';
const cal = new FcnaCalendar(); // cal.id === 'hijri-fcna'
```

### `HijriCalendar` (base class)

The base implementation. Accepts any `CalendarEngine` from hijri-core. Use this to build a Temporal calendar from a custom engine registered via `hijri-core`'s `registerCalendar()`.

```typescript
import { HijriCalendar } from 'temporal-hijri';
import { getCalendar, registerCalendar } from 'hijri-core';

// Register a custom engine first
registerCalendar('my-calendar', myEngine);
const cal = new HijriCalendar(getCalendar('my-calendar'));
// cal.id === 'hijri-my-calendar'
```

### Convenience singletons

`uaqCalendar` and `fcnaCalendar` are pre-constructed instances. They are shared objects and safe to reuse across calls.

```typescript
import { uaqCalendar, fcnaCalendar } from 'temporal-hijri';
```

---

## API

All methods receive a `Temporal.PlainDate` with an ISO (Gregorian) calendar. The PlainDate carries the ISO year/month/day; the calendar object interprets those coordinates.

| Method | Returns | Description |
|---|---|---|
| `year(date)` | `number` | Hijri year |
| `month(date)` | `number` | Hijri month (1-12) |
| `monthCode(date)` | `string` | Month code: `"M01"` through `"M12"` |
| `day(date)` | `number` | Day of the Hijri month (1-29 or 1-30) |
| `daysInMonth(date)` | `number` | Length of the Hijri month (29 or 30) |
| `daysInYear(date)` | `number` | Days in the Hijri year (354 or 355) |
| `monthsInYear(date)` | `number` | Always `12` |
| `inLeapYear(date)` | `boolean` | `true` if the year has 355 days |
| `dayOfWeek(date)` | `number` | ISO weekday: 1=Monday, 7=Sunday |
| `dayOfYear(date)` | `number` | Day position within the Hijri year |
| `weekOfYear(date)` | `number` | Week position within the Hijri year |
| `daysInWeek(date)` | `number` | Always `7` |
| `dateFromFields(fields)` | `Temporal.PlainDate` | Construct ISO PlainDate from `{year, month, day}` in Hijri |
| `yearMonthFromFields(fields)` | `Temporal.PlainYearMonth` | Construct from `{year, month}` in Hijri |
| `monthDayFromFields(fields)` | `Temporal.PlainMonthDay` | Construct from `{month, day}` in Hijri |
| `dateAdd(date, duration)` | `Temporal.PlainDate` | Add a duration; years/months applied in Hijri space, days in ISO space |
| `dateUntil(one, two, options)` | `Temporal.Duration` | Difference between two dates; supports `largestUnit: 'years'|'months'|'days'|'weeks'` |
| `mergeFields(fields, additional)` | `Record` | Merge field objects (Temporal protocol requirement) |
| `toString()` | `string` | Calendar identifier (`"hijri-uaq"` or `"hijri-fcna"`) |

---

## Calendar Systems

| System | ID | Authority | Method | Coverage |
|---|---|---|---|---|
| Umm al-Qura | `hijri-uaq` | KACST / Saudi Arabia | Pre-calculated tables | 1318-1500 AH (1900-2076 CE) |
| FCNA/ISNA | `hijri-fcna` | Fiqh Council of North America | Astronomical new moon (Meeus) | Unlimited (calculated) |

UAQ dates outside 1318-1500 AH throw `RangeError`. FCNA is unbounded but loses precision for very early dates.

---

## Custom Calendars

Any engine registered in hijri-core can be wrapped in a Temporal calendar:

```typescript
import { HijriCalendar } from 'temporal-hijri';
import { registerCalendar, getCalendar } from 'hijri-core';
import type { CalendarEngine } from 'hijri-core';

const myEngine: CalendarEngine = {
  id: 'local-sighting',
  toHijri(date) { /* ... */ return { hy, hm, hd }; },
  toGregorian(hy, hm, hd) { /* ... */ return new Date(...); },
  isValid(hy, hm, hd) { /* ... */ return true; },
  daysInMonth(hy, hm) { /* ... */ return 29; },
};

registerCalendar('local-sighting', myEngine);
const cal = new HijriCalendar(getCalendar('local-sighting'));
// cal.id === 'hijri-local-sighting'
```

---

## TypeScript

All types are exported:

```typescript
import type { HijriDate, ConversionOptions, HijriCalendarOptions } from 'temporal-hijri';
```

The package ships dual CJS/ESM builds with full `.d.ts` and `.d.mts` declarations.

---

## Compatibility

- Node.js 20, 22, 24
- Any bundler supporting `exports` field (`Vite`, `Webpack 5`, `Rollup`, `esbuild`)
- ESM (`import`) and CommonJS (`require`) — both provided
- No native `Temporal` required: works entirely with `@js-temporal/polyfill`

---

## Documentation

Full reference, architecture notes, and algorithmic detail in the [wiki](https://github.com/acamarata/temporal-hijri/wiki).

---

## Related

- [hijri-core](https://github.com/acamarata/hijri-core) — the zero-dependency Hijri engine powering this package
- [luxon-hijri](https://github.com/acamarata/luxon-hijri) — Hijri/Gregorian conversion for Luxon
- [pray-calc](https://github.com/acamarata/pray-calc) — Islamic prayer times

---

## License

MIT. Copyright (c) 2026 Aric Camarata. See [LICENSE](LICENSE).
