/**
 * ESM test suite for temporal-hijri.
 *
 * Test dates are chosen against verified Umm al-Qura and FCNA calendar data.
 * Reference point: 2023-03-23 = 1 Ramadan 1444 AH (both UAQ and FCNA agree).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Temporal } from '@js-temporal/polyfill';
import { UaqCalendar, FcnaCalendar, uaqCalendar, fcnaCalendar } from './dist/index.mjs';

// Reference date: 2023-03-23 = 1 Ramadan 1444 AH
const isoRamadan = Temporal.PlainDate.from('2023-03-23');
// 2023-04-21 = 1 Shawwal 1444 AH (first day after Ramadan)
const isoShawwal = Temporal.PlainDate.from('2023-04-21');
// 2021-08-09 = 1 Muharram 1443 AH (a 355-day / leap year)
const isoLeapYear = Temporal.PlainDate.from('2021-08-09');

// ── 1. Class exports ──────────────────────────────────────────────────────────

describe('Class exports', () => {
  it('UaqCalendar class export', () => {
    assert(UaqCalendar, 'UaqCalendar should be exported');
    const cal = new UaqCalendar();
    assert(cal instanceof UaqCalendar, 'UaqCalendar should be instantiable');
  });

  it('FcnaCalendar class export', () => {
    assert(FcnaCalendar, 'FcnaCalendar should be exported');
    const cal = new FcnaCalendar();
    assert(cal instanceof FcnaCalendar, 'FcnaCalendar should be instantiable');
  });
});

// ── 2. Calendar IDs ───────────────────────────────────────────────────────────

describe('Calendar IDs', () => {
  it('uaqCalendar.id', () => {
    assert.equal(uaqCalendar.id, 'hijri-uaq');
  });

  it('fcnaCalendar.id', () => {
    assert.equal(fcnaCalendar.id, 'hijri-fcna');
  });
});

// ── 3. Field accessors on 1 Ramadan 1444 (2023-03-23) ────────────────────────

describe('Field accessors (UAQ, 1 Ramadan 1444)', () => {
  it('year = 1444', () => {
    assert.equal(uaqCalendar.year(isoRamadan), 1444);
  });

  it('month = 9 (Ramadan)', () => {
    assert.equal(uaqCalendar.month(isoRamadan), 9);
  });

  it('day = 1', () => {
    assert.equal(uaqCalendar.day(isoRamadan), 1);
  });

  it('monthCode = "M09"', () => {
    assert.equal(uaqCalendar.monthCode(isoRamadan), 'M09');
  });

  it('daysInMonth = 29 (Ramadan 1444)', () => {
    assert.equal(uaqCalendar.daysInMonth(isoRamadan), 29);
  });

  it('monthsInYear = 12', () => {
    assert.equal(uaqCalendar.monthsInYear(isoRamadan), 12);
  });

  it('daysInWeek = 7', () => {
    assert.equal(uaqCalendar.daysInWeek(isoRamadan), 7);
  });

  it('dayOfWeek = 4 (Thursday)', () => {
    assert.equal(uaqCalendar.dayOfWeek(isoRamadan), 4);
  });

  it('dayOfYear = 237', () => {
    assert.equal(uaqCalendar.dayOfYear(isoRamadan), 237);
  });
});

// ── 4. dateFromFields ─────────────────────────────────────────────────────────

describe('dateFromFields', () => {
  it('dateFromFields({year:1444, month:9, day:1}) = 2023-03-23', () => {
    const result = uaqCalendar.dateFromFields({ year: 1444, month: 9, day: 1 });
    assert.equal(result.toString(), '2023-03-23');
  });
});

// ── 5. dateAdd ────────────────────────────────────────────────────────────────

describe('dateAdd', () => {
  it('adding 1 month from 1 Ramadan 1444 lands on 1 Shawwal 1444', () => {
    const oneMonth = new Temporal.Duration(0, 1, 0, 0);
    const result = uaqCalendar.dateAdd(isoRamadan, oneMonth);
    assert.equal(result.toString(), isoShawwal.toString());
    assert.equal(uaqCalendar.month(result), 10);
  });

  it('adding 7 days from 1 Ramadan 1444', () => {
    const sevenDays = new Temporal.Duration(0, 0, 0, 7);
    const result = uaqCalendar.dateAdd(isoRamadan, sevenDays);
    assert.equal(uaqCalendar.day(result), 8);
    assert.equal(uaqCalendar.month(result), 9);
  });

  it('adding 1 week from 1 Ramadan 1444', () => {
    const oneWeek = new Temporal.Duration(0, 0, 1, 0);
    const result = uaqCalendar.dateAdd(isoRamadan, oneWeek);
    assert.equal(uaqCalendar.day(result), 8);
    assert.equal(uaqCalendar.month(result), 9);
  });

  it('adding 12 months rolls the year forward', () => {
    const twelveMonths = new Temporal.Duration(0, 12, 0, 0);
    const result = uaqCalendar.dateAdd(isoRamadan, twelveMonths);
    assert.equal(uaqCalendar.year(result), 1445);
    assert.equal(uaqCalendar.month(result), 9);
  });

  it('subtracting months via negative duration', () => {
    const negMonth = new Temporal.Duration(0, -1, 0, 0);
    const result = uaqCalendar.dateAdd(isoShawwal, negMonth);
    assert.equal(uaqCalendar.month(result), 9);
    assert.equal(uaqCalendar.year(result), 1444);
  });
});

// ── 6. dateUntil ──────────────────────────────────────────────────────────────

describe('dateUntil', () => {
  it('days between 1 Ramadan and 1 Shawwal 1444', () => {
    const dur = uaqCalendar.dateUntil(isoRamadan, isoShawwal, { largestUnit: 'days' });
    assert.equal(dur.days, 29);
  });

  it('months between 1 Ramadan and 1 Shawwal 1444', () => {
    const dur = uaqCalendar.dateUntil(isoRamadan, isoShawwal, { largestUnit: 'months' });
    assert.equal(dur.months, 1);
    assert.equal(dur.days, 0);
  });

  it('years between dates spanning one Hijri year', () => {
    const iso1443 = uaqCalendar.dateFromFields({ year: 1443, month: 1, day: 1 });
    const iso1444 = uaqCalendar.dateFromFields({ year: 1444, month: 1, day: 1 });
    const dur = uaqCalendar.dateUntil(iso1443, iso1444, { largestUnit: 'years' });
    assert.equal(dur.years, 1);
    assert.equal(dur.months, 0);
    assert.equal(dur.days, 0);
  });

  it('weeks between dates', () => {
    const dur = uaqCalendar.dateUntil(isoRamadan, isoShawwal, { largestUnit: 'weeks' });
    assert.equal(dur.weeks, 4);
    assert.equal(dur.days, 1);
  });
});

// ── 7. inLeapYear ─────────────────────────────────────────────────────────────

describe('inLeapYear', () => {
  it('1443 AH (355 days) is a leap year, 1444 AH (354) is not', () => {
    assert.equal(uaqCalendar.inLeapYear(isoLeapYear), true);
    assert.equal(uaqCalendar.inLeapYear(isoRamadan), false);
  });
});

// ── 8. FCNA calendar ──────────────────────────────────────────────────────────

describe('FCNA calendar', () => {
  it('fcnaCalendar.year(2023-03-23) returns a valid Hijri year', () => {
    const year = fcnaCalendar.year(isoRamadan);
    assert(typeof year === 'number' && year > 1400, `Expected a Hijri year > 1400, got ${year}`);
  });
});

// ── 9. Out-of-range error ─────────────────────────────────────────────────────

describe('Out-of-range error', () => {
  it('uaqCalendar.year throws RangeError for out-of-range date (1800-01-01)', () => {
    const outOfRange = Temporal.PlainDate.from('1800-01-01');
    assert.throws(
      () => uaqCalendar.year(outOfRange),
      (err) => err instanceof RangeError,
    );
  });
});

// ── 10. overflow option ───────────────────────────────────────────────────────

describe('overflow option', () => {
  it('dateFromFields with overflow: "constrain" clamps day', () => {
    const result = uaqCalendar.dateFromFields(
      { year: 1444, month: 9, day: 31 },
      { overflow: 'constrain' },
    );
    assert.equal(uaqCalendar.day(result), 29);
    assert.equal(uaqCalendar.month(result), 9);
  });

  it('dateFromFields with overflow: "reject" throws RangeError', () => {
    assert.throws(
      () => uaqCalendar.dateFromFields({ year: 1444, month: 9, day: 31 }, { overflow: 'reject' }),
      (err) => err instanceof RangeError,
    );
  });

  it('monthDayFromFields with overflow: "constrain" clamps day', () => {
    const result = uaqCalendar.monthDayFromFields({ month: 9, day: 31 }, { overflow: 'constrain' });
    assert.ok(result);
  });

  it('monthDayFromFields with overflow: "reject" throws RangeError', () => {
    assert.throws(
      () => uaqCalendar.monthDayFromFields({ month: 9, day: 31 }, { overflow: 'reject' }),
      (err) => err instanceof RangeError,
    );
  });
});

// ── 11. fields() ──────────────────────────────────────────────────────────────

describe('fields()', () => {
  it('returns the input array unchanged', () => {
    const input = ['year', 'month', 'day'];
    const result = uaqCalendar.fields(input);
    assert.deepEqual(result, ['year', 'month', 'day']);
  });

  it('returns an empty array for empty input', () => {
    assert.deepEqual(uaqCalendar.fields([]), []);
  });
});

// ── 12. yearMonthFromFields ─────────────────────────────────────────────────

describe('yearMonthFromFields', () => {
  it('creates a PlainYearMonth for Ramadan 1444', () => {
    const result = uaqCalendar.yearMonthFromFields({ year: 1444, month: 9 });
    assert.ok(result);
    assert.equal(result.month, 3);
    assert.equal(result.year, 2023);
  });
});

// ── 13. monthDayFromFields ──────────────────────────────────────────────────

describe('monthDayFromFields', () => {
  it('creates a PlainMonthDay for 15 Ramadan (default reference year)', () => {
    const result = uaqCalendar.monthDayFromFields({ month: 9, day: 15 });
    assert.ok(result);
  });

  it('creates a PlainMonthDay with explicit year', () => {
    const result = uaqCalendar.monthDayFromFields({ month: 9, day: 1, year: 1445 });
    assert.ok(result);
  });
});
