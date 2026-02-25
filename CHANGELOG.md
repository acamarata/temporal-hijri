# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-25

### Added

- `HijriCalendar` base class implementing the TC39 Temporal Calendar Protocol
- `UaqCalendar`: Umm al-Qura calendar (table-driven, 1318-1500 AH coverage)
- `FcnaCalendar`: FCNA/ISNA calendar (astronomical new moon calculation via Meeus)
- `uaqCalendar` and `fcnaCalendar` convenience singletons
- Full Temporal protocol: `year`, `month`, `monthCode`, `day`, `daysInMonth`, `daysInYear`, `monthsInYear`, `inLeapYear`, `dayOfWeek`, `dayOfYear`, `weekOfYear`, `daysInWeek`, `dateFromFields`, `yearMonthFromFields`, `monthDayFromFields`, `dateAdd`, `dateUntil`, `mergeFields`, `toString`
- Dual CJS and ESM builds with TypeScript declarations
- Peer dependency on `hijri-core ^1.0.0` for conversion logic
- Optional peer dependency on `@js-temporal/polyfill ^0.4.0`
