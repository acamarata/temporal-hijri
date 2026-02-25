import { getCalendar } from 'hijri-core';
import { HijriCalendar } from './HijriCalendar';

/**
 * Temporal calendar implementation for the Umm al-Qura calendar.
 *
 * Umm al-Qura is the official calendar of Saudi Arabia, maintained by the
 * King Abdulaziz City for Science and Technology (KACST). It is the most
 * widely used Hijri calendar standard for civil and religious purposes across
 * the Muslim world. Month boundaries are determined by pre-calculated tables
 * rather than real-time moon sighting.
 *
 * Calendar engine: hijri-core UAQ (table-driven, covers 1318-1500 AH).
 * Calendar ID: "hijri-uaq"
 */
export class UaqCalendar extends HijriCalendar {
  constructor() {
    super(getCalendar('uaq'));
  }
}
