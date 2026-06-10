# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-06-10

### Fixed
- Date handed to hijri-core is now built via `Date.UTC()` to match hijri-core's UTC-day
  contract; fixes previous-day results on east-of-UTC hosts (e.g. UTC+5, UTC+8).
  Requires hijri-core 1.0.3.

## [1.0.2] - 2026-05-30

### Added
- TSDoc comments on all public `HijriCalendar` methods

### Changed
- README condensed; quickstart trimmed to essential examples
- CI: corepack before setup-node, prettier scoped to src/, d.mts emitted via postbuild
- Adopt shared config packages (@acamarata/eslint-config, @acamarata/prettier-config, @acamarata/tsconfig)

## [1.0.1] - 2026-05-28

### Changed
- Flatten exports map to ADR-015 standard (import/require/types at top level)
- Add "./package.json" export condition
- Add coverage script (c8 --reporter=lcov)
- Migrate CI from pnpm/action-setup to corepack enable

## [1.0.0] - 2026-05-28

### Added
- Initial release
