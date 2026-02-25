# Architecture

## The Temporal Calendar Protocol

The TC39 Temporal proposal (Stage 3, actively shipping in browsers) replaces the legacy `Date` object with a family of types: `PlainDate`, `PlainTime`, `PlainDateTime`, `ZonedDateTime`, `Instant`, and more. Central to its design is an extensible calendar system.

A `Temporal.PlainDate` always stores its fields (year, month, day) in terms of a specific calendar. The ISO 8601 (Gregorian) calendar is the default. Custom calendars implement an interface — informally called the Temporal Calendar Protocol — that lets the `PlainDate` compute calendar-specific values from those fields, perform arithmetic, and convert between calendar systems.

`temporal-hijri` implements this protocol for the Hijri (Islamic) calendar.

## Protocol Implementation

The protocol requires these methods on a calendar object:

```
year(date)          month(date)         monthCode(date)
day(date)           daysInMonth(date)   daysInYear(date)
monthsInYear(date)  inLeapYear(date)    dayOfWeek(date)
dayOfYear(date)     weekOfYear(date)    daysInWeek(date)
dateFromFields(fields, options)
yearMonthFromFields(fields, options)
monthDayFromFields(fields, options)
dateAdd(date, duration, options)
dateUntil(one, two, options)
mergeFields(fields, additionalFields)
toString()
```

`HijriCalendar` implements all of these. The key challenge is that `Temporal.PlainDate` stores ISO coordinates (Gregorian year/month/day), while the methods must return Hijri coordinates — and `dateFromFields` must do the reverse.

## Coordinate Bridging

Every calendar method follows the same two-step pattern:

1. Receive a `Temporal.PlainDate` with ISO coordinates.
2. Convert to Hijri coordinates using `toHijri()`, which constructs a JavaScript `Date` from the ISO fields and passes it to the hijri-core engine.

```
Temporal.PlainDate (ISO)  →  toHijri()  →  {hy, hm, hd}
```

The inverse path:

```
{hy, hm, hd}  →  fromHijri()  →  Temporal.PlainDate (ISO)
```

`fromHijri()` calls the engine's `toGregorian()`, reads UTC components from the returned `Date`, and constructs a `PlainDate`.

### Date object construction

The UAQ engine reads local date components (`getFullYear`, `getMonth`, `getDate`). To ensure the local date always matches the intended calendar date — regardless of the host's timezone — `toHijri()` uses the local `Date` constructor: `new Date(year, month - 1, day)`. This avoids the UTC-to-local shift that would occur with `Date.UTC`.

The FCNA engine reads UTC components for its astronomical calculations. The UTC-local discrepancy is at most one day, which falls within the tolerance of FCNA's calculation window.

## dateAdd: Arithmetic Strategy

Adding a duration to a Hijri date requires different handling for different duration components:

- **Years and months** must be applied in Hijri space. Adding "1 month" to 1 Ramadan should yield 1 Shawwal — not a fixed 30-day offset. The Hijri calendar has months of 29 and 30 days in no fixed pattern, so month arithmetic must account for actual month lengths.

- **Days and weeks** can be applied in ISO (Gregorian) space after the Hijri-space year/month addition. Adding 7 days means exactly 7 days, and ISO arithmetic handles that correctly.

The implementation:

```
1. Extract Hijri coordinates from the input PlainDate.
2. Add years and months to the Hijri coordinates.
3. Normalize: roll months > 12 or < 1 into years.
4. Clamp the day to the target month's actual length.
5. Convert back to ISO PlainDate.
6. Apply the day and week delta with ISO PlainDate.add().
```

Clamping (step 4) follows the Temporal specification's "constrain" overflow behavior. Adding 1 month to 30 Rajab (a 30-day month) where Shaban is 29 days would yield 30 Shaban — instead, the result is clamped to 29 Shaban.

## dateUntil: Difference Strategy

For `largestUnit: 'days'` or `'weeks'`, the difference between two ISO dates is always an exact number of days. ISO arithmetic handles this directly and correctly.

For `largestUnit: 'years'` or `'months'`, the difference is computed in Hijri space:

```
years  = h2.hy - h1.hy
months = h2.hm - h1.hm
days   = h2.hd - h1.hd
```

Borrow operations normalize negative days (by borrowing from months, adding the actual length of the preceding Hijri month) and negative months (by borrowing from years). This matches the behavior expected by the Temporal specification for calendar-aware subtraction.

## Class Hierarchy

```
HijriCalendar          ← base, accepts any CalendarEngine
  UaqCalendar          ← wraps hijri-core 'uaq' engine
  FcnaCalendar         ← wraps hijri-core 'fcna' engine
```

The subclasses exist for naming and documentation clarity. All logic is in `HijriCalendar`. Extending with a custom engine requires only instantiating `HijriCalendar` directly with a registered engine.

## Dependency on hijri-core

hijri-core provides:

- `CalendarEngine` interface (the contract this package relies on)
- `getCalendar(id)` registry function
- Built-in UAQ engine (table-driven, Hijri years 1318-1500)
- Built-in FCNA engine (Meeus Chapter 49 astronomical calculations)

`temporal-hijri` is a pure adapter layer. It does not implement any calendar arithmetic itself — it translates between the Temporal protocol and hijri-core's engine interface.

## Build Output

The package ships two formats from a single TypeScript source:

| File | Format | Usage |
|---|---|---|
| `dist/index.mjs` | ESM | `import { uaqCalendar } from 'temporal-hijri'` |
| `dist/index.cjs` | CommonJS | `const { uaqCalendar } = require('temporal-hijri')` |
| `dist/index.d.ts` | Type declarations (CJS) | TypeScript + CJS |
| `dist/index.d.mts` | Type declarations (ESM) | TypeScript + ESM |

Both `hijri-core` and `@js-temporal/polyfill` are declared `external` in the build config and listed as peer dependencies. They are not bundled.

## Limitations

- **Temporal is still a proposal.** Native `Temporal` is available in Chrome 127+, Firefox 139+, and Safari 18.2+. Node.js ships Temporal behind a flag. The package works with `@js-temporal/polyfill` for full compatibility today.
- **UAQ coverage is bounded.** Dates before 1318 AH (1900 CE) or after 1500 AH (2076 CE) throw `RangeError` from the UAQ calendar. Use FCNA for dates outside this range.
- **`monthDayFromFields` requires a reference year.** Without a year, the function defaults to 1444 AH. The resulting `PlainMonthDay` is a structural type in ISO space and does not preserve the Hijri year.
- **`weekOfYear` is approximate.** The Hijri calendar has no standardized week numbering system. The implementation uses `ceil(dayOfYear / 7)`, which gives a consistent ordering but does not align with any official standard.

---

[Home](Home) · [API Reference](API-Reference) · [Architecture](Architecture)
