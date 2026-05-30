# Example: Scheduling Display with Hijri Dates

A common need in calendaring apps for Muslim communities is displaying both the
Gregorian and Hijri dates for an event. This example shows how to take a list of
event dates, annotate each with its Hijri date, and display it in a human-readable
format.

## Setup

```typescript
import { Temporal } from '@js-temporal/polyfill';
import { uaqCalendar } from 'temporal-hijri';
```

## Month name lookup

The calendar returns numeric months (1-12). Map them to names:

```typescript
const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Ula', 'Jumada al-Akhira', 'Rajab', 'Shaban',
  'Ramadan', 'Shawwal', 'Dhul-Qadah', 'Dhul-Hijja',
];

function hijriMonthName(month: number): string {
  return HIJRI_MONTHS[month - 1] ?? 'Unknown';
}
```

## Format a single date

```typescript
function formatWithHijri(isoDateStr: string): string {
  const isoDate = Temporal.PlainDate.from(isoDateStr);
  const hy = uaqCalendar.year(isoDate);
  const hm = uaqCalendar.month(isoDate);
  const hd = uaqCalendar.day(isoDate);

  const monthName = hijriMonthName(hm);
  return `${isoDateStr}  (${hd} ${monthName} ${hy} AH)`;
}
```

## Annotate a schedule

```typescript
const events = [
  { title: 'Project kickoff',  date: '2025-01-01' },
  { title: 'Mid-year review',  date: '2025-06-15' },
  { title: 'Year-end summary', date: '2025-12-31' },
];

for (const event of events) {
  console.log(`${event.title}: ${formatWithHijri(event.date)}`);
}
```

Output:

```
Project kickoff: 2025-01-01  (2 Rajab 1446 AH)
Mid-year review: 2025-06-15  (19 Dhul-Hijja 1446 AH)
Year-end summary: 2025-12-31  (11 Jumada al-Akhira 1447 AH)
```

## Find the start of Ramadan for a given Hijri year

```typescript
function ramadanStart(hijriYear: number): Temporal.PlainDate {
  // 1 Ramadan = month 9, day 1
  return uaqCalendar.dateFromFields({ year: hijriYear, month: 9, day: 1 });
}

const ramadan1447 = ramadanStart(1447);
console.log(ramadan1447.toString()); // 2026-02-18 (approximate)
```

## Count days until an event in Hijri months

```typescript
const today = Temporal.Now.plainDateISO();
const eid = uaqCalendar.dateFromFields({ year: 1447, month: 10, day: 1 });
const diff = uaqCalendar.dateUntil(today, eid, { largestUnit: 'months' });

console.log(`Eid al-Fitr 1447 is in ${diff.months} month(s) and ${diff.days} day(s)`);
```

## Notes

- Month names are transliterated from Arabic. Adapt the spelling to your style guide.
- UAQ covers 1318-1500 AH. For dates outside that range, substitute `fcnaCalendar`.
- `Temporal.Now.plainDateISO()` returns the current date in the host's local calendar.
  It does not return a Hijri date directly; pass the result to the calendar methods
  to get Hijri coordinates.

---

[Home](../Home) · [Basic Usage](basic-usage) · [API Reference](../API-Reference)
