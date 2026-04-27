# Limitations

This repository is useful, but it is still an early open-source Agent Skill package.

## Scanner Limits

- `audit-plugin.mjs` is a heuristic scanner, not a security oracle.
- Static checks can miss issues and can produce false positives.
- Security, performance, design, and compatibility findings need human review before release decisions.
- The scanner does not execute WordPress, render block editor screens, or inspect a live theme/plugin stack.

## WordPress Runtime Limits

- Default CI does not start a full WordPress runtime.
- No real Yoast, Rank Math, WP Rocket, Elementor, theme, or page-builder installation is tested in CI yet.
- Compatibility claims remain conservative until versions are manually verified and documented.
- Cache behavior depends on hosting, page cache, object cache, CDN, server config, and plugin settings.

## Documentation Limits

- WordPress, Gutenberg, Interactivity API, Agent Skills tooling, Cursor, Claude Code, and Codex packaging can change.
- Release-sensitive tasks should verify current official docs before implementing advanced patterns.
- This repository summarizes guidance; it does not copy official documentation wholesale.

## Design And Performance Limits

- Visual quality needs real wp-admin/editor/frontend review.
- Accessibility checks need keyboard and assistive technology testing.
- Performance recommendations need profiling with realistic data, traffic, hosting, theme, and plugin combinations.
- Cache changes need explicit invalidation tests.

