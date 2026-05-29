# Quick Start

This guide covers the most common use cases in temporal-hijri. All examples use `uaqCalendar` (Umm al-Qura). For FCNA/ISNA output, substitute `fcnaCalendar`.

## Installation

```bash
pnpm add temporal-hijri hijri-core @js-temporal/polyfill
```

`hijri-core` is required. `@js-temporal/polyfill` is required in environments without native `Temporal` support. In environments with native Temporal (Node 22+ with the flag, or future standard support), omit the polyfill.

## Import

```typescript
import { Temporal } from '@js-temporal/polyfill'; // or use native Temporal
import { uaqCalendar } from 'temporal-hijri';
```

## Convert an ISO date to Hijri

```typescript
const isoDate = Temporal.PlainDate.from('2023-03-23');

console.log(uaqCalendar.year(isoDate));       // 1444
console.log(uaqCalendar.month(isoDate));      // 9
console.log(uaqCalendar.day(isoDate));        // 1
console.log(uaqCalendar.monthCode(isoDate));  // 'M09'
```

## Convert Hijri coordinates to ISO

```typescript
const ramadan = uaqCalendar.dateFromFields({ year: 1444, month: 9, day: 1 });
console.log(ramadan.toString()); // '2023-03-23'
```

## Date arithmetic in Hijri space

```typescript
const { Duration } = Temporal;

const isoDate = Temporal.PlainDate.from('2023-03-23');

// Add one Hijri month
const nextMonth = uaqCalendar.dateAdd(isoDate, new Duration(0, 1));
console.log(uaqCalendar.month(nextMonth)); // 10 (Shawwal)
console.log(nextMonth.toString());          // '2023-04-21'

// Get the difference between two dates
const earlier = Temporal.PlainDate.from('2023-01-01');
const later   = Temporal.PlainDate.from('2023-03-23');
const diff = uaqCalendar.dateUntil(earlier, later, { largestUnit: 'months' });
console.log(diff.months); // 2 (in Hijri months)
```

## Use the FCNA calendar

```typescript
import { fcnaCalendar } from 'temporal-hijri';

const isoDate = Temporal.PlainDate.from('2023-03-23');
console.log(fcnaCalendar.year(isoDate));  // 1444
console.log(fcnaCalendar.month(isoDate)); // 9 or may differ by 1 near month start
```

## Singletons vs classes

The package exports convenience singletons for the common case:

```typescript
import { uaqCalendar, fcnaCalendar } from 'temporal-hijri';
```

If you need to construct a calendar from a custom hijri-core engine:

```typescript
import { HijriCalendar } from 'temporal-hijri';
import { registerCalendar, getCalendar } from 'hijri-core';

registerCalendar('my-engine', myEngine);
const cal = new HijriCalendar(getCalendar('my-engine'));
```

## CommonJS

```js
const { Temporal } = require('@js-temporal/polyfill');
const { uaqCalendar } = require('temporal-hijri');

const isoDate = Temporal.PlainDate.from('2023-03-23');
console.log(uaqCalendar.year(isoDate)); // 1444
```

## Next steps

- [API Reference](API-Reference) for all calendar protocol methods
- [Architecture](Architecture) for how the Temporal Calendar Protocol is implemented
