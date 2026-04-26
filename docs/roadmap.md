# Roadmap

This roadmap is intentionally short. It is meant to guide contribution, not promise dates.

## Current Status: v0.1.0

Stable enough to use as a public work-in-progress Agent Skill package:

- canonical skill folder;
- synchronized install targets;
- curated WordPress references;
- starter templates;
- local validation and audit scripts;
- fixture-based demo output;
- GitHub workflow for validation.

Experimental or version-dependent:

- Cursor skill install path and slash invocation;
- deep Plugin Check automation;
- live WordPress runtime testing;
- broad security scanner coverage.
- static performance checks are heuristic and do not replace profiling.
- static design/UX checks are heuristic and do not replace manual visual, keyboard, and assistive-technology review.

## v0.2.0 Candidates

- Stronger fixture coverage for REST, admin settings, AJAX, SQL, filesystem, and block rendering.
- More Gutenberg examples, including dynamic and interactive blocks.
- Expanded audit heuristics for nonces, capabilities, escaping, uploads, SSRF, and SQL patterns.
- Optional docs refresh workflow that verifies official source links and review dates.
- Clearer Cursor installation documentation by version/workflow.
- Optional PHP/Composer CI matrix if the repository gains real PHP package checks.
- Optional profiling workflow with Query Monitor/manual profiling notes.
- Richer performance fixture coverage for REST, admin screens, cron, block render, custom tables, and assets.
- More block performance examples with before/after render and asset-loading patterns.
- CI checks for the performance audit fixture.
- Optional benchmark harness for sample plugins without publishing fake benchmark claims.
- More precise false-positive handling in `audit-plugin.mjs` performance rules.
- Docs refresh against current WordPress performance APIs.
- Richer admin UI examples for settings pages, dashboards, notices, and onboarding flows.
- More Gutenberg block UI patterns for placeholders, toolbar actions, InspectorControls, and mobile editor constraints.
- Screenshot-based manual review workflow for wp-admin, editor, and frontend output.
- Optional Playwright visual smoke tests if the project adds browser-test infrastructure.
- Figma/WordPress Design System notes that clearly mark experimental packages and current-doc verification needs.
- Better accessibility fixture coverage for labels, focus, field errors, modals, live regions, and keyboard flows.
- Contrast helper/checker where feasible without overclaiming static certainty.
- Support for design audit screenshots as optional evidence.
- More frontend theme-compatibility examples for blocks, shortcodes, and widgets.

## Collaboration Entry Points

See [starter issues](starter-issues.md) for concrete contribution ideas.

Maintainers should pin a roadmap issue or enable GitHub Discussions after the first public release is published.
