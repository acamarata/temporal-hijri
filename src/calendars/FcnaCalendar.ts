import { getCalendar } from 'hijri-core';
import { HijriCalendar } from './HijriCalendar';

/**
 * Temporal calendar implementation for the FCNA/ISNA calendar.
 *
 * The Fiqh Council of North America (FCNA) calendar, also used by the Islamic
 * Society of North America (ISNA), determines month starts through astronomical
 * calculation: a new month begins the day after the conjunction (new moon) if
 * that conjunction occurs before 12:00 noon UTC, or two days after if at or
 * after noon. This criterion enables global date-setting without local moon
 * sighting, making it popular for diaspora Muslim communities in North America
 * and Europe.
 *
 * Calendar engine: hijri-core FCNA (Meeus Chapter 49 calculations).
 * Calendar ID: "hijri-fcna"
 */
export class FcnaCalendar extends HijriCalendar {
  constructor() {
    super(getCalendar('fcna'));
  }
}
