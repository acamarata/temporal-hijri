# Basic Usage Examples

## Setup

```typescript
import { Temporal } from '@js-temporal/polyfill';
import { uaqCalendar } from 'temporal-hijri';
```

## Convert a Gregorian date to Hijri

```typescript
// 23 March 2023 = 1 Ramadan 1444 AH
const isoDate = Temporal.PlainDate.from('2023-03-23');

console.log(uaqCalendar.year(isoDate));   // 1444
console.log(uaqCalendar.month(isoDate));  // 9  (Ramadan is the 9th month)
console.log(uaqCalendar.day(isoDate));    // 1
```

## Read today's Hijri date

```typescript
import { Temporal } from '@js-temporal/polyfill';
import { uaqCalendar } from 'temporal-hijri';

const today = Temporal.Now.plainDateISO();
const hy = uaqCalendar.year(today);
const hm = uaqCalendar.month(today);
const hd = uaqCalendar.day(today);

console.log(`${hd} / ${hm} / ${hy}`);
```

## Create a Hijri date and convert to ISO

```typescript
const ramadan1 = uaqCalendar.dateFromFields({ year: 1444, month: 9, day: 1 });
console.log(ramadan1.toString());  // '2023-03-23'
```

## Add Hijri months

```typescript
const start = uaqCalendar.dateFromFields({ year: 1444, month: 9, day: 1 });
const twoMonthsLater = uaqCalendar.dateAdd(start, new Temporal.Duration(0, 0, 0, 2 * 29));
// Durations use days — calculate from expected month length

// Or use dateUntil to measure between two dates
const end = Temporal.PlainDate.from('2023-05-20');
const diff = uaqCalendar.dateUntil(start, end, { largestUnit: 'months' });
console.log(diff.months, diff.days);
```

## Use FCNA calendar

```typescript
import { fcnaCalendar } from 'temporal-hijri';

const isoDate = Temporal.PlainDate.from('2023-03-23');

console.log(fcnaCalendar.year(isoDate));   // 1444
console.log(fcnaCalendar.month(isoDate));  // 9
console.log(fcnaCalendar.day(isoDate));    // 1
// Near month boundaries, UAQ and FCNA may differ by one day
```

## CJS usage

```javascript
const { Temporal } = require('@js-temporal/polyfill');
const { uaqCalendar } = require('temporal-hijri');

const d = Temporal.PlainDate.from('2023-03-23');
console.log(uaqCalendar.year(d));  // 1444
```
