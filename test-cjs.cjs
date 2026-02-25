'use strict';

/**
 * CJS test suite for temporal-hijri.
 *
 * Verifies that the CommonJS build loads and functions correctly via require().
 */

const assert = require('node:assert/strict');
const { Temporal } = require('@js-temporal/polyfill');
const { UaqCalendar, FcnaCalendar, uaqCalendar, fcnaCalendar } = require('./dist/index.cjs');

let passed = 0;
let failed = 0;
const total = 8;

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

const isoRamadan = Temporal.PlainDate.from('2023-03-23');

// ── Class and singleton exports ───────────────────────────────────────────────

test('UaqCalendar class loads via require', () => {
  assert(typeof UaqCalendar === 'function', 'UaqCalendar should be a constructor');
  const cal = new UaqCalendar();
  assert.equal(cal.id, 'hijri-uaq');
});

test('FcnaCalendar class loads via require', () => {
  assert(typeof FcnaCalendar === 'function', 'FcnaCalendar should be a constructor');
  const cal = new FcnaCalendar();
  assert.equal(cal.id, 'hijri-fcna');
});

test('uaqCalendar singleton id', () => {
  assert.equal(uaqCalendar.id, 'hijri-uaq');
});

test('fcnaCalendar singleton id', () => {
  assert.equal(fcnaCalendar.id, 'hijri-fcna');
});

// ── Field accessors ───────────────────────────────────────────────────────────

test('uaqCalendar.year(2023-03-23) = 1444', () => {
  assert.equal(uaqCalendar.year(isoRamadan), 1444);
});

test('uaqCalendar.month(2023-03-23) = 9', () => {
  assert.equal(uaqCalendar.month(isoRamadan), 9);
});

test('uaqCalendar.day(2023-03-23) = 1', () => {
  assert.equal(uaqCalendar.day(isoRamadan), 1);
});

// ── dateFromFields ─────────────────────────────────────────────────────────────

test('uaqCalendar.dateFromFields({year:1444, month:9, day:1}) = 2023-03-23', () => {
  const result = uaqCalendar.dateFromFields({ year: 1444, month: 9, day: 1 });
  assert.equal(result.toString(), '2023-03-23');
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${passed}/${total} tests passed`);
if (failed > 0) {
  console.error(`${failed} test(s) failed`);
  process.exit(1);
}
