# API Reference

## Exports

```typescript
// Classes
export { HijriCalendar } from 'temporal-hijri';
export { UaqCalendar }   from 'temporal-hijri';
export { FcnaCalendar }  from 'temporal-hijri';

// Singletons
export { uaqCalendar }  from 'temporal-hijri'; // new UaqCalendar()
export { fcnaCalendar } from 'temporal-hijri'; // new FcnaCalendar()

// Types (re-exported from hijri-core)
export type { HijriDate, ConversionOptions } from 'temporal-hijri';
export type { HijriCalendarOptions }         from 'temporal-hijri';
```

---

## `HijriCalendar`

Base class. Implements the Temporal Calendar Protocol using a `CalendarEngine` from hijri-core.

### Constructor

```typescript
new HijriCalendar(engine: CalendarEngine)
```

Accepts any engine registered via hijri-core's `registerCalendar()`. The calendar's `id` is `hijri-${engine.id}`.

---

## `UaqCalendar`

```typescript
new UaqCalendar()
```

Wraps the `uaq` engine from hijri-core. Calendar ID: `"hijri-uaq"`.

---

## `FcnaCalendar`

```typescript
new FcnaCalendar()
```

Wraps the `fcna` engine from hijri-core. Calendar ID: `"hijri-fcna"`.

---

## Calendar Protocol Methods

All methods are available on `HijriCalendar`, `UaqCalendar`, and `FcnaCalendar`. Each method receives a `Temporal.PlainDate` with the ISO (Gregorian) calendar.

### Field accessors

| Method | Signature | Returns | Notes |
|---|---|---|---|
| `year` | `(date: PlainDate) => number` | Hijri year | |
| `month` | `(date: PlainDate) => number` | Hijri month (1-12) | |
| `monthCode` | `(date: PlainDate) => string` | `"M01"` – `"M12"` | Zero-padded |
| `day` | `(date: PlainDate) => number` | Day of month (1-29/30) | |

### Year and month metrics

| Method | Signature | Returns | Notes |
|---|---|---|---|
| `daysInMonth` | `(date: PlainDate) => number` | 29 or 30 | Varies by month and calendar |
| `daysInYear` | `(date: PlainDate) => number` | 354 or 355 | Sum of all 12 months |
| `monthsInYear` | `(date: PlainDate) => number` | Always 12 | |
| `inLeapYear` | `(date: PlainDate) => boolean` | `true` if 355-day year | |

### Week and day position

| Method | Signature | Returns | Notes |
|---|---|---|---|
| `dayOfWeek` | `(date: PlainDate) => number` | 1-7 (Mon=1, Sun=7) | ISO weekday |
| `dayOfYear` | `(date: PlainDate) => number` | 1-354 or 1-355 | Within the Hijri year |
| `weekOfYear` | `(date: PlainDate) => number` | 1-51 | `ceil(dayOfYear / 7)` |
| `daysInWeek` | `(date: PlainDate) => number` | Always 7 | |

### Construction from fields

| Method | Signature | Returns |
|---|---|---|
| `dateFromFields` | `(fields: {year, month, day}, options?) => PlainDate` | ISO `PlainDate` |
| `yearMonthFromFields` | `(fields: {year, month}, options?) => PlainYearMonth` | ISO `PlainYearMonth` |
| `monthDayFromFields` | `(fields: {month, day, year?}, options?) => PlainMonthDay` | ISO `PlainMonthDay` |

`monthDayFromFields` uses year 1444 AH as a default reference if no year is supplied.

### Arithmetic

#### `dateAdd`

```typescript
dateAdd(
  date: Temporal.PlainDate,
  duration: Temporal.Duration,
  options?: { overflow?: 'constrain' | 'reject' }
): Temporal.PlainDate
```

Adds a duration to a Hijri date. Year and month components are applied in Hijri space (preserving calendar semantics); day and week components are applied in ISO space afterward.

When a month addition causes the day-of-month to exceed the target month's length, the day is clamped to the last valid day of that month.

#### `dateUntil`

```typescript
dateUntil(
  one: Temporal.PlainDate,
  two: Temporal.PlainDate,
  options?: { largestUnit?: 'years' | 'months' | 'weeks' | 'days' }
): Temporal.Duration
```

Computes the difference between two dates. When `largestUnit` is `'years'` or `'months'`, the difference is calculated in Hijri space. For `'days'` and `'weeks'` it delegates to ISO arithmetic, which is exact.

### Other

| Method | Signature | Returns |
|---|---|---|
| `mergeFields` | `(fields, additionalFields) => Record` | Merged field object |
| `toString` | `() => string` | Calendar identifier |

---

## Types

### `HijriDate` (from hijri-core)

```typescript
interface HijriDate {
  hy: number; // Hijri year
  hm: number; // Hijri month (1-12)
  hd: number; // Hijri day (1-30)
}
```

### `ConversionOptions` (from hijri-core)

```typescript
interface ConversionOptions {
  calendar?: string; // defaults to 'uaq'
}
```

### `HijriCalendarOptions`

```typescript
interface HijriCalendarOptions {
  calendar?: string;
}
```

---

[Home](Home) · [API Reference](API-Reference) · [Architecture](Architecture)
