export { HijriCalendar } from "./calendars/HijriCalendar";
export { UaqCalendar } from "./calendars/UaqCalendar";
export { FcnaCalendar } from "./calendars/FcnaCalendar";

export type { HijriDate, CalendarEngine, ConversionOptions } from "hijri-core";

// Pre-built singletons. Import and use directly; no need to instantiate.
import { UaqCalendar } from "./calendars/UaqCalendar";
import { FcnaCalendar } from "./calendars/FcnaCalendar";

export const uaqCalendar = new UaqCalendar();
export const fcnaCalendar = new FcnaCalendar();

// ── Opt-in anonymous telemetry ────────────────────────────────────────────────
// Off by default. Enable: ACAMARATA_TELEMETRY=1
// What is sent + how to disable: https://github.com/acamarata/telemetry/blob/main/TELEMETRY.md
import("@acamarata/telemetry")
  .then(({ track }) => track("load", { package: "temporal-hijri", version: "1.0.3" }))
  .catch(() => {
    // telemetry not installed or disabled — that is fine
  });
