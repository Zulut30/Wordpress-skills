# Agent Notes

Use `skills/wordpress-plugin-dev/SKILL.md` as the canonical entry point.

Before making WordPress-version-sensitive recommendations, load `references/source-map.md` and verify the current official docs for the relevant tool or API.

For local checks:

```bash
npm run validate:skill
npm run check:sources
npm run test:audit
npm run audit:fixture
npm run performance:audit
npm run performance:audit:json
npm run design:audit
npm run design:audit:json
npm run smoke
```

Do not edit generated install target copies directly. Edit the canonical skill folder, then run:

```bash
npm run sync
```

Treat `audit-plugin.mjs` findings as triage signals, not proof of security. Verify release-sensitive Codex, Cursor, Claude Code, WordPress.org, Plugin Check, WP-CLI, npm, and Composer behavior against current official documentation before publishing.

## Performance Defaults

- Identify hot paths before optimizing.
- Never remove security checks for speed.
- Avoid expensive work on every request.
- Scope assets by frontend/admin/editor/screen/block.
- Bound queries and paginate collections.
- Use `no_found_rows` when pagination totals are not needed.
- Use `fields => ids` when only IDs are required.
- Cache expensive safe operations with TTL and invalidation.
- Avoid remote HTTP calls during render without cache/fallback.
- Avoid large autoloaded options.
- Do not call `flush_rewrite_rules()` on normal requests.
- Treat static scanner output as heuristic.

## Design Defaults

- Prefer WordPress-native UI in wp-admin.
- Do not add heavy UI frameworks by default.
- Use clear labels and accessible form structure.
- Do not use placeholder text as a label.
- Design empty, loading, success, error, and edge states.
- Keep one clear primary action per screen/section.
- Use progressive disclosure for advanced settings.
- Scope admin and frontend CSS.
- Frontend output should inherit theme styles where practical.
- Never remove security checks or escaping for visual polish.
- UI text must be i18n-ready.
- Consider keyboard navigation, focus, contrast, RTL, and text expansion.
- Treat design scanner output as heuristic.
