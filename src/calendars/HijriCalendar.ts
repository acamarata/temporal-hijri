import { Temporal } from '@js-temporal/polyfill';
import type { CalendarEngine } from 'hijri-core';

type DateUnit = 'year' | 'years' | 'month' | 'months' | 'week' | 'weeks' | 'day' | 'days' | 'auto';

/**
 * Base class implementing the TC39 Temporal Calendar Protocol for Hijri calendars.
 *
 * Coordinate bridging: Temporal.PlainDate operates in the ISO (Gregorian) calendar.
 * Every calendar method receives a PlainDate with ISO year/month/day, and must
 * return results in the Hijri calendar's coordinate system. The bridge is
 * toHijri() and fromHijri(), which delegate to the injected CalendarEngine.
 *
 * Arithmetic strategy for dateAdd():
 *   - Year and month deltas are applied in Hijri space (correct handling of
 *     variable month lengths).
 *   - Day and week deltas are applied in ISO space after the Hijri addition,
 *     so that "add 30 days" always means exactly 30 days.
 */
export class HijriCalendar {
  protected readonly engine: CalendarEngine;
  readonly id: string;

  constructor(engine: CalendarEngine) {
    this.engine = engine;
    this.id = `hijri-${engine.id}`;
  }

  toString(): string {
    return this.id;
  }

  /**
   * Convert a Temporal.PlainDate (ISO calendar) to Hijri coordinates.
   *
   * Uses the local-time Date constructor so that the date components passed to
   * the engine match the calendar date exactly, regardless of host timezone.
   * The UAQ engine reads local components; the FCNA engine reads UTC components.
   * Because we construct with new Date(y, m, d) the local date always matches
   * the intended calendar date.
   */
  protected toHijri(date: Temporal.PlainDate): { hy: number; hm: number; hd: number } {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    const hijri = this.engine.toHijri(jsDate);
    if (!hijri) {
      throw new RangeError(
        `Date ${date.toString()} is out of range for the ${this.id} calendar`
      );
    }
    return hijri;
  }

  /**
   * Convert Hijri coordinates to a Temporal.PlainDate (ISO calendar).
   *
   * The engine returns a Date whose UTC components represent the Gregorian date.
   * We extract those UTC components to construct the PlainDate.
   */
  protected fromHijri(hy: number, hm: number, hd: number): Temporal.PlainDate {
    const greg = this.engine.toGregorian(hy, hm, hd);
    if (!greg) {
      throw new RangeError(
        `Hijri date ${hy}/${hm}/${hd} is out of range for the ${this.id} calendar`
      );
    }
    return Temporal.PlainDate.from({
      year: greg.getUTCFullYear(),
      month: greg.getUTCMonth() + 1,
      day: greg.getUTCDate(),
    });
  }

  // ── Field accessors ───────────────────────────────────────────────────────

  year(date: Temporal.PlainDate): number {
    return this.toHijri(date).hy;
  }

  month(date: Temporal.PlainDate): number {
    return this.toHijri(date).hm;
  }

  /**
   * Month code per the Temporal proposal: "M01".."M12".
   * Hijri months are always 1-12 (no leap/intercalary month), so the code is
   * simply the zero-padded month number.
   */
  monthCode(date: Temporal.PlainDate): string {
    const { hm } = this.toHijri(date);
    return `M${String(hm).padStart(2, '0')}`;
  }

  day(date: Temporal.PlainDate): number {
    return this.toHijri(date).hd;
  }

  // ── Month and year metrics ─────────────────────────────────────────────────

  daysInMonth(date: Temporal.PlainDate): number {
    const { hy, hm } = this.toHijri(date);
    return this.engine.daysInMonth(hy, hm);
  }

  /**
   * Sum all 12 month lengths for the Hijri year. Standard lunar years are 354
   * days; leap years (with an added day in Dhul-Hijja) are 355 days.
   */
  daysInYear(date: Temporal.PlainDate): number {
    const { hy } = this.toHijri(date);
    let total = 0;
    for (let m = 1; m <= 12; m++) {
      total += this.engine.daysInMonth(hy, m);
    }
    return total;
  }

  monthsInYear(_date: Temporal.PlainDate): number {
    return 12;
  }

  inLeapYear(date: Temporal.PlainDate): boolean {
    return this.daysInYear(date) === 355;
  }

  // ── Day-of-week and day-of-year ────────────────────────────────────────────

  /**
   * ISO weekday: 1 = Monday, 7 = Sunday.
   * PlainDate.dayOfWeek on an ISO-calendar date already gives ISO weekday,
   * so no conversion is needed.
   */
  dayOfWeek(date: Temporal.PlainDate): number {
    return date.dayOfWeek;
  }

  /**
   * Day within the Hijri year. Accumulates full months before the current one,
   * then adds the day-of-month offset.
   */
  dayOfYear(date: Temporal.PlainDate): number {
    const { hy, hm, hd } = this.toHijri(date);
    let total = hd;
    for (let m = 1; m < hm; m++) {
      total += this.engine.daysInMonth(hy, m);
    }
    return total;
  }

  weekOfYear(date: Temporal.PlainDate): number {
    return Math.ceil(this.dayOfYear(date) / 7);
  }

  daysInWeek(_date: Temporal.PlainDate): number {
    return 7;
  }

  // ── Construction from fields ───────────────────────────────────────────────

  dateFromFields(
    fields: { year: number; month: number; day: number },
    _options?: { overflow?: 'constrain' | 'reject' }
  ): Temporal.PlainDate {
    return this.fromHijri(fields.year, fields.month, fields.day);
  }

  yearMonthFromFields(
    fields: { year: number; month: number },
    _options?: { overflow?: 'constrain' | 'reject' }
  ): Temporal.PlainYearMonth {
    const isoDate = this.fromHijri(fields.year, fields.month, 1);
    return Temporal.PlainYearMonth.from({
      year: isoDate.year,
      month: isoDate.month,
    });
  }

  monthDayFromFields(
    fields: { month: number; day: number; year?: number },
    _options?: { overflow?: 'constrain' | 'reject' }
  ): Temporal.PlainMonthDay {
    // A reference year is needed to resolve the Hijri month/day to an ISO date.
    // Default to 1444 AH (2022-2023 CE), a recent well-covered year.
    const year = fields.year ?? 1444;
    const isoDate = this.fromHijri(year, fields.month, fields.day);
    return Temporal.PlainMonthDay.from({
      month: isoDate.month,
      day: isoDate.day,
    });
  }

  // ── Arithmetic ─────────────────────────────────────────────────────────────

  /**
   * Add a duration to a Hijri date.
   *
   * Year and month additions are handled in Hijri space to preserve calendar
   * semantics (e.g., adding one month to 1 Ramadan yields 1 Shawwal, not a
   * fixed 30-day offset). Day and week additions are then applied in ISO space
   * so that they always represent exact day counts.
   *
   * When the day-of-month exceeds the target month's length after a Hijri-space
   * adjustment, it is clamped to the last valid day of that month.
   */
  dateAdd(
    date: Temporal.PlainDate,
    duration: Temporal.Duration,
    _options?: { overflow?: 'constrain' | 'reject' }
  ): Temporal.PlainDate {
    const { hy, hm, hd } = this.toHijri(date);

    let newHy = hy + (duration.years ?? 0);
    let newHm = hm + (duration.months ?? 0);

    // Normalize month overflow into years.
    while (newHm > 12) {
      newHm -= 12;
      newHy++;
    }
    while (newHm < 1) {
      newHm += 12;
      newHy--;
    }

    // Clamp day to the valid range for the target month.
    const maxDay = this.engine.daysInMonth(newHy, newHm);
    const clampedDay = Math.min(hd, maxDay);

    // Convert the Hijri result back to ISO, then apply the day/week delta.
    const intermediate = this.fromHijri(newHy, newHm, clampedDay);
    const dayDelta = (duration.days ?? 0) + (duration.weeks ?? 0) * 7;
    return dayDelta !== 0 ? intermediate.add({ days: dayDelta }) : intermediate;
  }

  /**
   * Compute the difference between two Hijri dates.
   *
   * For simplicity and correctness across variable-length Hijri months, this
   * delegates to the underlying ISO PlainDate difference when the largest unit
   * is days or weeks. Year/month differences require a Hijri-space calculation.
   */
  dateUntil(
    one: Temporal.PlainDate,
    two: Temporal.PlainDate,
    options?: { largestUnit?: DateUnit }
  ): Temporal.Duration {
    const largestUnit: DateUnit = options?.largestUnit ?? 'days';

    if (largestUnit === 'years' || largestUnit === 'year') {
      const h1 = this.toHijri(one);
      const h2 = this.toHijri(two);

      let years = h2.hy - h1.hy;
      let months = h2.hm - h1.hm;
      let days = h2.hd - h1.hd;

      // Borrow from months when days are negative.
      if (days < 0) {
        months--;
        // Add the day count of the previous Hijri month to resolve the borrow.
        let borrowHm = h2.hm - 1;
        let borrowHy = h2.hy;
        if (borrowHm < 1) {
          borrowHm = 12;
          borrowHy--;
        }
        days += this.engine.daysInMonth(borrowHy, borrowHm);
      }

      // Borrow from years when months are negative.
      if (months < 0) {
        years--;
        months += 12;
      }

      return new Temporal.Duration(years, months, 0, days);
    }

    if (largestUnit === 'months' || largestUnit === 'month') {
      const h1 = this.toHijri(one);
      const h2 = this.toHijri(two);

      let years = h2.hy - h1.hy;
      let months = h2.hm - h1.hm;
      let days = h2.hd - h1.hd;

      if (days < 0) {
        months--;
        let borrowHm = h2.hm - 1;
        let borrowHy = h2.hy;
        if (borrowHm < 1) {
          borrowHm = 12;
          borrowHy--;
        }
        days += this.engine.daysInMonth(borrowHy, borrowHm);
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      // Roll years into months.
      return new Temporal.Duration(0, years * 12 + months, 0, days);
    }

    // For weeks and days, delegate to ISO arithmetic which is exact.
    if (largestUnit === 'weeks' || largestUnit === 'week') {
      return one.until(two, { largestUnit: 'weeks' });
    }

    return one.until(two, { largestUnit: 'days' });
  }

  mergeFields(
    fields: Record<string, unknown>,
    additionalFields: Record<string, unknown>
  ): Record<string, unknown> {
    return { ...fields, ...additionalFields };
  }
}
