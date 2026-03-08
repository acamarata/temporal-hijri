'use strict';

/**
 * CJS test suite for temporal-hijri.
 *
 * Verifies that the CommonJS build loads and functions correctly via require().
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { Temporal } = require('@js-temporal/polyfill');
const { UaqCalendar, FcnaCalendar, uaqCalendar, fcnaCalendar } = require('./dist/index.cjs');

const isoRamadan = Temporal.PlainDate.from('2023-03-23');

// ── Class and singleton exports ───────────────────────────────────────────────

describe('CJS class exports', () => {
  it('UaqCalendar class loads via require', () => {
    assert(typeof UaqCalendar === 'function', 'UaqCalendar should be a constructor');
    const cal = new UaqCalendar();
    assert.equal(cal.id, 'hijri-uaq');
  });

  it('FcnaCalendar class loads via require', () => {
    assert(typeof FcnaCalendar === 'function', 'FcnaCalendar should be a constructor');
    const cal = new FcnaCalendar();
    assert.equal(cal.id, 'hijri-fcna');
  });

  it('uaqCalendar singleton id', () => {
    assert.equal(uaqCalendar.id, 'hijri-uaq');
  });

  it('fcnaCalendar singleton id', () => {
    assert.equal(fcnaCalendar.id, 'hijri-fcna');
  });
});

// ── Field accessors ───────────────────────────────────────────────────────────

describe('CJS field accessors', () => {
  it('uaqCalendar.year(2023-03-23) = 1444', () => {
    assert.equal(uaqCalendar.year(isoRamadan), 1444);
  });

  it('uaqCalendar.month(2023-03-23) = 9', () => {
    assert.equal(uaqCalendar.month(isoRamadan), 9);
  });

  it('uaqCalendar.day(2023-03-23) = 1', () => {
    assert.equal(uaqCalendar.day(isoRamadan), 1);
  });
});

// ── dateFromFields ─────────────────────────────────────────────────────────────

describe('CJS dateFromFields', () => {
  it('uaqCalendar.dateFromFields({year:1444, month:9, day:1}) = 2023-03-23', () => {
    const result = uaqCalendar.dateFromFields({ year: 1444, month: 9, day: 1 });
    assert.equal(result.toString(), '2023-03-23');
  });
});

// ── fields() ──────────────────────────────────────────────────────────────────

describe('CJS fields()', () => {
  it('returns the input array unchanged', () => {
    assert.deepEqual(uaqCalendar.fields(['year', 'month', 'day']), ['year', 'month', 'day']);
  });
});
