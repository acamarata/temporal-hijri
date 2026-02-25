# temporal-hijri

Temporal Calendar Protocol implementation for the Hijri calendar system.

This package provides `UaqCalendar` and `FcnaCalendar` as plug-in calendar objects for the TC39 `Temporal` proposal. It bridges the ISO-centric `Temporal.PlainDate` API with Hijri date arithmetic via [hijri-core](https://github.com/acamarata/hijri-core).

## Pages

- [Home](Home): you are here
- [API Reference](API-Reference): full method signatures and return types
- [Architecture](Architecture): design decisions, protocol internals, arithmetic strategy

## Quick links

- [GitHub repository](https://github.com/acamarata/temporal-hijri)
- [npm package](https://www.npmjs.com/package/temporal-hijri)
- [hijri-core](https://github.com/acamarata/hijri-core): the underlying calendar engine

## Calendar systems

| Calendar | ID | Description |
|---|---|---|
| Umm al-Qura | `hijri-uaq` | Official Saudi calendar, table-driven, covers 1318-1500 AH |
| FCNA/ISNA | `hijri-fcna` | North American standard, astronomical new moon calculation |

## Requirements

- Node.js 20+
- `hijri-core ^1.0.0` (peer dependency)
- `@js-temporal/polyfill ^0.4.0` (optional peer dependency, needed if native `Temporal` is unavailable)

---

[Home](Home) · [API Reference](API-Reference) · [Architecture](Architecture)
