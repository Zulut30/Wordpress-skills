# Contributing

Thanks for improving WordPress Plugin Dev Skill. This project is intentionally small, source-backed, and practical.

## Project Philosophy

- Keep the skill useful for real WordPress plugin work.
- Keep `SKILL.md` compact and route detailed guidance into `references/`.
- Prefer official WordPress and tool documentation as sources.
- Do not copy official documentation wholesale.
- Keep scripts local-first, clear, and non-destructive.
- Mark version-sensitive guidance as needing verification against current official docs.

## Local Setup

```bash
npm install
npm run validate:skill
npm run smoke
```

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

## Validate Changes

Run before opening a PR:

```bash
npm run validate:skill
npm run smoke
```

If you changed the canonical skill, sync install targets:

```bash
npm run sync
```

## Update `source-map.md`

Update `skills/wordpress-plugin-dev/references/source-map.md` when you add or change a topic that depends on official docs.

Each source entry should include:

- Title
- Official URL
- What to use it for
- When to verify online
- Last reviewed date
- Notes for agent behavior

## Add A Reference File

- Put it under `skills/wordpress-plugin-dev/references/`.
- Add `Last reviewed: YYYY-MM-DD`.
- Add an `Official Sources` section.
- Use concise original notes, checklists, examples, anti-patterns, and remediation guidance.
- Add routing from `SKILL.md` only if agents need to discover it directly.

## Add A Template

- Put it under `skills/wordpress-plugin-dev/assets/templates/`.
- Use clear placeholders such as `{{PLUGIN_SLUG}}`, `{{PLUGIN_NAME}}`, `{{TEXT_DOMAIN}}`, `{{VENDOR_NAMESPACE}}`, and `{{PLUGIN_VERSION}}`.
- Keep it safe by default: capability checks, nonces where relevant, sanitization on input, escaping on output.
- Avoid hidden dependencies or clever magic.
- Update `validate-skill.mjs` if the template should become required.

## Add An Audit Rule

- Keep `audit-plugin.mjs` heuristic and transparent.
- Add tests in `audit-plugin.test.mjs`.
- Prefer findings with severity, file, line, clear message, and remediation.
- Avoid claiming certainty when the scanner only detects patterns.

## Documentation Style

- Be direct and operational.
- Prefer short examples over long prose.
- Link to official sources instead of copying their content.
- Clearly mark limitations and version-sensitive areas.

## Safe Script Rules

- Scripts should not require secrets.
- Scripts should not make network calls unless explicitly documented.
- Scripts should not delete user data outside narrowly defined generated targets.
- Destructive behavior must be guarded and explained in output.

## PR Checklist

- `SKILL.md` remains concise.
- References are updated where needed.
- `source-map.md` is updated for new official sources.
- Templates remain safe by default.
- Scripts are local-first and non-destructive.
- `npm run validate:skill` passed.
- `npm run smoke` passed.
- No copied official documentation.
- No secrets or generated junk committed.
