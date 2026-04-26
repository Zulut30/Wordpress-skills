# Agent Notes

Use `skills/wordpress-plugin-dev/SKILL.md` as the canonical entry point.

Before making WordPress-version-sensitive recommendations, load `references/source-map.md` and verify the current official docs for the relevant tool or API.

For local checks:

```bash
npm run validate
npm run check:sources
npm run audit:fixture
```

Do not edit generated install target copies directly. Edit the canonical skill folder, then run:

```bash
npm run sync:targets
```
