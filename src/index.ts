export { HijriCalendar } from './calendars/HijriCalendar';
export { UaqCalendar } from './calendars/UaqCalendar';
export { FcnaCalendar } from './calendars/FcnaCalendar';

export type { HijriDate, CalendarEngine, ConversionOptions } from 'hijri-core';

// Pre-built singletons. Import and use directly; no need to instantiate.
import { UaqCalendar } from './calendars/UaqCalendar';
import { FcnaCalendar } from './calendars/FcnaCalendar';

export const uaqCalendar = new UaqCalendar();
export const fcnaCalendar = new FcnaCalendar();
