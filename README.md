[![npm version](https://img.shields.io/npm/v/temporal-hijri.svg)](https://www.npmjs.com/package/temporal-hijri)
[![CI](https://github.com/acamarata/temporal-hijri/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/temporal-hijri/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

# temporal-hijri

Temporal Calendar Protocol implementation for the Hijri calendar. Works with the TC39
Temporal proposal (Stage 3) and `@js-temporal/polyfill`.

Provides `UaqCalendar` (Umm al-Qura) and `FcnaCalendar` (FCNA/ISNA) as plug-in
calendars for `Temporal.PlainDate`. The underlying conversion logic comes from
[hijri-core](https://github.com/acamarata/hijri-core).

## Installation

```bash
pnpm add temporal-hijri hijri-core
# Add the polyfill if native Temporal is unavailable:
pnpm add @js-temporal/polyfill
```

## Quick Start

```typescript
import { Temporal } from '@js-temporal/polyfill';
import { uaqCalendar } from 'temporal-hijri';

const isoDate = Temporal.PlainDate.from('2023-03-23');

console.log(uaqCalendar.year(isoDate));      // 1444
console.log(uaqCalendar.month(isoDate));     // 9  (Ramadan)
console.log(uaqCalendar.day(isoDate));       // 1

// Convert Hijri coordinates to ISO
const ramadan = uaqCalendar.dateFromFields({ year: 1444, month: 9, day: 1 });
console.log(ramadan.toString()); // "2023-03-23"

// Date arithmetic in Hijri space
const { Duration } = Temporal;
const nextMonth = uaqCalendar.dateAdd(isoDate, new Duration(0, 1));
console.log(uaqCalendar.month(nextMonth)); // 10 (Shawwal)
```

## Calendars

| Calendar    | ID           | Authority          | Method                   | Coverage         |
|-------------|--------------|--------------------|--------------------------|------------------|
| Umm al-Qura | `hijri-uaq`  | KACST, Saudi Arabia | Pre-calculated tables    | 1318-1500 AH     |
| FCNA/ISNA   | `hijri-fcna` | Fiqh Council of NA | Astronomical new moon    | Unbounded        |

## Documentation

Full reference in the [wiki](https://github.com/acamarata/temporal-hijri/wiki).

- [API Reference](https://github.com/acamarata/temporal-hijri/wiki/API-Reference)
- [Architecture](https://github.com/acamarata/temporal-hijri/wiki/Architecture)
- [Examples](https://github.com/acamarata/temporal-hijri/wiki/examples/basic-usage)

## Conversion behavior

Conversions between ISO and Hijri dates are pure calendar-date mappings: the same
ISO date always maps to the same Hijri date on every machine, regardless of the host's
timezone. `Temporal.PlainDate` carries no time-of-day information, and the underlying
hijri-core engine operates on UTC calendar days, so there is no timezone dependency.

Note: the Islamic calendar begins a new day at sunset, not midnight. This library
follows the civil-calendar convention (midnight boundary) used by most software. Sunset
day-start determination is out of scope.

## Related

- [hijri-core](https://github.com/acamarata/hijri-core): the underlying calendar engine
- [luxon-hijri](https://github.com/acamarata/luxon-hijri): Hijri support for Luxon
- [pray-calc](https://github.com/acamarata/pray-calc): Islamic prayer times

## Telemetry

This package supports opt-in anonymous usage telemetry — off by default.
Enable: `ACAMARATA_TELEMETRY=1`. See [TELEMETRY.md](./TELEMETRY.md) for what is sent and how to disable.

## License

MIT. Copyright (c) 2026 Aric Camarata. See [LICENSE](LICENSE).
