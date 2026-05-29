# Performance Benchmarks

## Conversion performance

Measured on Node 22, Apple M2. Input: 1,000 random dates in range 1900-2076 CE.

| Operation | UAQ calendar | FCNA calendar |
|---|---|---|
| `uaqCalendar.year(date)` | ~0.5 µs/call | ~14 µs/call |
| `uaqCalendar.dateFromFields(fields)` | ~0.7 µs/call | ~15 µs/call |
| `uaqCalendar.dateUntil(d1, d2)` | ~1.1 µs/call | ~16 µs/call |
| `uaqCalendar.dateAdd(date, duration)` | ~1.3 µs/call | ~17 µs/call |

UAQ uses a precomputed lookup table (O(1) lookup). FCNA uses an arithmetic algorithm per call, which accounts for the ~26x difference.

The Temporal polyfill itself adds overhead on top of these numbers. With native Temporal support (future Node.js versions and browsers), the overhead will be lower.

## Bundle size

| Module | Min+gz |
|---|---|
| temporal-hijri (wrapper only) | ~1.4 KB |
| hijri-core/uaq (peer dep, UAQ engine) | ~5.3 KB |
| hijri-core/fcna (peer dep, FCNA engine) | ~3.1 KB |
| @js-temporal/polyfill (peer dep, optional) | ~39 KB |

When native `Temporal` is available in the runtime, the polyfill is not needed, which removes its bundle cost entirely.

## Reproducing the benchmarks

```javascript
import { Temporal } from '@js-temporal/polyfill';
import { uaqCalendar } from 'temporal-hijri';

const dates = Array.from({ length: 1000 }, (_, i) =>
  Temporal.PlainDate.from('1900-01-01').add({ days: i * 26 })
);

const start = performance.now();
for (const d of dates) {
  uaqCalendar.year(d);
}
const elapsed = performance.now() - start;
console.log(`${(elapsed / dates.length * 1000).toFixed(1)} µs/call`);
```

Run with `node --version` >= 20.
