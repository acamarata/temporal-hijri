# Advanced Usage

## Custom calendar engines

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

## DateUntil with different largestUnit values

`dateUntil` respects the `largestUnit` option:

```typescript
import { Temporal } from '@js-temporal/polyfill';
import { uaqCalendar } from 'temporal-hijri';

const start = Temporal.PlainDate.from('2023-01-01');
const end   = Temporal.PlainDate.from('2023-12-31');

const inYears  = uaqCalendar.dateUntil(start, end, { largestUnit: 'years' });
const inMonths = uaqCalendar.dateUntil(start, end, { largestUnit: 'months' });
const inDays   = uaqCalendar.dateUntil(start, end, { largestUnit: 'days' });

console.log(inYears.years, inYears.months, inYears.days);
console.log(inMonths.months, inMonths.days);
console.log(inDays.days);
```

Note: the result measures in Hijri units. One Hijri year is 354 or 355 days, so `inYears.days` may differ from what you would expect in Gregorian.

## PlainYearMonth and PlainMonthDay

```typescript
import { Temporal } from '@js-temporal/polyfill';
import { uaqCalendar } from 'temporal-hijri';

// Year-month in Hijri
const ym = uaqCalendar.yearMonthFromFields({ year: 1444, month: 9 });
console.log(ym.toString()); // ISO year-month of 1 Ramadan 1444

// Month-day in Hijri
const md = uaqCalendar.monthDayFromFields({ month: 9, day: 1 });
console.log(md.toString()); // ISO month-day of Ramadan 1st
```

## Out-of-range behavior

UAQ covers 1318-1500 AH (1900-2076 CE). Requesting dates outside that range throws `RangeError`:

```typescript
const earlyDate = Temporal.PlainDate.from('1800-01-01');
try {
  uaqCalendar.year(earlyDate); // throws RangeError
} catch (e) {
  if (e instanceof RangeError) {
    // Use FCNA for unbounded coverage
    import { fcnaCalendar } from 'temporal-hijri';
    console.log(fcnaCalendar.year(earlyDate));
  }
}
```

## Using with native Temporal

When native `Temporal` is available (future Node.js or browsers), you can use it directly without the polyfill:

```typescript
// No import from @js-temporal/polyfill
import { uaqCalendar } from 'temporal-hijri';

const isoDate = Temporal.PlainDate.from('2023-03-23');
console.log(uaqCalendar.year(isoDate)); // 1444
```

The `uaqCalendar` and `fcnaCalendar` objects implement the `Temporal.CalendarProtocol` interface and work with any spec-conforming implementation.
