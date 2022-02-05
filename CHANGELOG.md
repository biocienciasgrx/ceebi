# CEEBI Changelog

This file serves to keep track of changes across versions of the app.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0-alpha] - 2022-02-05

### Added

- Icons to events set from the web itself
- Multiple speakers in events
- Provisional ripple effect for events

### Changed

- **BREAKING (Android)**: Changed package id to `es.biociencias.ceebi`

## [0.3.3-alpha] - 2022-02-04 [YANKED]

### Added

- Images for sponsors in about page
- Main structure of about page
- Changelog file
- Added error handling for image download without connection

### Changed

- Reduced characters in notification extract from 50 to 30
- Refactor code to centralize constants
- Clean up: `views/QRCode.vue`, `views/Settings.vue`
- Add 2 and 3 minutes options and remove 90 and 120 minutes options to event reminders time

### Fixed

- Images not properly loading from cache
- Showing _alt_ text in case images don't load

[Unreleased]: https://github.com/biocienciasgrx/ceeebi/compare/v0.3.3-alpha...HEAD
[0.3.2-alpha]: https://github.com/biocienciasgrx/ceebi/releases/tag/v0.3.3-alpha