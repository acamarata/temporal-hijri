/**
 * ESM test suite for temporal-hijri.
 *
 * Test dates are chosen against verified Umm al-Qura and FCNA calendar data.
 * Reference point: 2023-03-23 = 1 Ramadan 1444 AH (both UAQ and FCNA agree).
 */

import assert from 'node:assert/strict';
import { Temporal } from '@js-temporal/polyfill';
import { UaqCalendar, FcnaCalendar, uaqCalendar, fcnaCalendar } from './dist/index.mjs';

let passed = 0;
let failed = 0;
const total = 18;

function test(name, fn) {
  try {
    fn();
    console.log(`[${name}]... PASS`);
    passed++;
  } catch (err) {
    console.error(`[${name}]... FAIL: ${err.message}`);
    failed++;
  }
}

// Reference date: 2023-03-23 = 1 Ramadan 1444 AH
const isoRamadan = Temporal.PlainDate.from('2023-03-23');
// 2023-04-21 = 1 Shawwal 1444 AH (first day after Ramadan)
const isoShawwal = Temporal.PlainDate.from('2023-04-21');
// 2021-08-09 = 1 Muharram 1443 AH (a 355-day / leap year)
const isoLeapYear = Temporal.PlainDate.from('2021-08-09');

// ── 1. Class exports ──────────────────────────────────────────────────────────

test('UaqCalendar class export', () => {
  assert(UaqCalendar, 'UaqCalendar should be exported');
  const cal = new UaqCalendar();
  assert(cal instanceof UaqCalendar, 'UaqCalendar should be instantiable');
});

test('FcnaCalendar class export', () => {
  assert(FcnaCalendar, 'FcnaCalendar should be exported');
  const cal = new FcnaCalendar();
  assert(cal instanceof FcnaCalendar, 'FcnaCalendar should be instantiable');
});

// ── 2. Calendar IDs ───────────────────────────────────────────────────────────

test('uaqCalendar.id', () => {
  assert.equal(uaqCalendar.id, 'hijri-uaq');
});

test('fcnaCalendar.id', () => {
  assert.equal(fcnaCalendar.id, 'hijri-fcna');
});

// ── 3. Field accessors on 1 Ramadan 1444 (2023-03-23) ────────────────────────

test('uaqCalendar.year(2023-03-23) = 1444', () => {
  assert.equal(uaqCalendar.year(isoRamadan), 1444);
});

test('uaqCalendar.month(2023-03-23) = 9 (Ramadan)', () => {
  assert.equal(uaqCalendar.month(isoRamadan), 9);
});

test('uaqCalendar.day(2023-03-23) = 1', () => {
  assert.equal(uaqCalendar.day(isoRamadan), 1);
});

test('uaqCalendar.monthCode(2023-03-23) = "M09"', () => {
  assert.equal(uaqCalendar.monthCode(isoRamadan), 'M09');
});

test('uaqCalendar.daysInMonth(2023-03-23) = 29 (Ramadan 1444 is 29 days)', () => {
  assert.equal(uaqCalendar.daysInMonth(isoRamadan), 29);
});

test('uaqCalendar.monthsInYear(2023-03-23) = 12', () => {
  assert.equal(uaqCalendar.monthsInYear(isoRamadan), 12);
});

test('uaqCalendar.daysInWeek(2023-03-23) = 7', () => {
  assert.equal(uaqCalendar.daysInWeek(isoRamadan), 7);
});

// 2023-03-23 is a Thursday. ISO weekday: 1=Mon, ..., 4=Thu, ..., 7=Sun.
test('uaqCalendar.dayOfWeek(2023-03-23) = 4 (Thursday)', () => {
  assert.equal(uaqCalendar.dayOfWeek(isoRamadan), 4);
});

// dayOfYear: sum of months 1-8 in 1444 + 1 (first day of month 9).
// Months 1-8 of 1444 total 236 days, so day 237 of the year.
test('uaqCalendar.dayOfYear(2023-03-23) = 237', () => {
  assert.equal(uaqCalendar.dayOfYear(isoRamadan), 237);
});

// ── 4. dateFromFields ─────────────────────────────────────────────────────────

test('uaqCalendar.dateFromFields({year:1444, month:9, day:1}) = 2023-03-23', () => {
  const result = uaqCalendar.dateFromFields({ year: 1444, month: 9, day: 1 });
  assert.equal(result.toString(), '2023-03-23');
});

// ── 5. dateAdd ────────────────────────────────────────────────────────────────

test('uaqCalendar.dateAdd: adding 1 month from 1 Ramadan 1444 lands on 1 Shawwal 1444', () => {
  const oneMonth = new Temporal.Duration(0, 1, 0, 0);
  const result = uaqCalendar.dateAdd(isoRamadan, oneMonth);
  // 1 Shawwal 1444 = 2023-04-21
  assert.equal(result.toString(), isoShawwal.toString());
  // Verify the result is in Shawwal (month 10)
  assert.equal(uaqCalendar.month(result), 10);
});

// ── 6. inLeapYear ─────────────────────────────────────────────────────────────

test('uaqCalendar.inLeapYear: 1443 AH (355 days) is a leap year, 1444 AH (354) is not', () => {
  // 2021-08-09 = 1 Muharram 1443 (355-day year)
  assert.equal(uaqCalendar.inLeapYear(isoLeapYear), true);
  // 2023-03-23 = in 1444 (354-day year)
  assert.equal(uaqCalendar.inLeapYear(isoRamadan), false);
});

// ── 7. FCNA calendar ──────────────────────────────────────────────────────────

// Both UAQ and FCNA agree on 1 Ramadan 1444 = 2023-03-23
test('fcnaCalendar.year(2023-03-23) returns a valid Hijri year', () => {
  const year = fcnaCalendar.year(isoRamadan);
  assert(typeof year === 'number' && year > 1400, `Expected a Hijri year > 1400, got ${year}`);
});

// ── 8. Out-of-range error ─────────────────────────────────────────────────────

test('uaqCalendar.year throws RangeError for out-of-range date (1800-01-01)', () => {
  // UAQ table covers 1318-1500 AH (Gregorian 1900-2076). 1800 is out of range.
  const outOfRange = Temporal.PlainDate.from('1800-01-01');
  assert.throws(
    () => uaqCalendar.year(outOfRange),
    (err) => err instanceof RangeError
  );
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${passed}/${total} tests passed`);
if (failed > 0) {
  console.error(`${failed} test(s) failed`);
  process.exit(1);
}
