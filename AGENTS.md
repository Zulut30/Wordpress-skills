# Agent Notes

Use `skills/wordpress-plugin-dev/SKILL.md` as the canonical entry point.

Before making WordPress-version-sensitive recommendations, load `references/source-map.md` and verify the current official docs for the relevant tool or API.

For local checks:

```bash
npm run validate:skill
npm run check:sources
npm run test:audit
npm run audit:fixture
npm run smoke
```

Do not edit generated install target copies directly. Edit the canonical skill folder, then run:

```bash
npm run sync
```

Treat `audit-plugin.mjs` findings as triage signals, not proof of security. Verify release-sensitive Codex, Cursor, Claude Code, WordPress.org, Plugin Check, WP-CLI, npm, and Composer behavior against current official documentation before publishing.
