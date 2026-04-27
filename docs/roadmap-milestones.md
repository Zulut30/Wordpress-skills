# Roadmap Milestones

Use these milestones in GitHub if they are not already created. Do not add fake dates.

## v0.2.0 - Hardening and CI

Focus:

- make PHP/Composer checks more useful;
- decide whether PHPCS should become blocking;
- add template placeholder substitution tests;
- improve local release packaging;
- keep README and reports organized.

Suggested issues:

- Add PHPCS/WPCS coverage for generated plugin templates.
- Add PHPStan baseline for safe source files.
- Add wp-env smoke test blueprint.

## v0.3.0 - Compatibility Verification

Focus:

- verify one SEO plugin with exact version notes;
- verify one cache/performance plugin with exact version notes;
- add Classic Editor plus Block Editor manual verification notes;
- update `docs/compatibility-matrix.md` with real evidence.

Suggested issues:

- Add real Classic Editor manual verification notes.
- Add compatibility verification for one SEO plugin.
- Add compatibility verification for one cache plugin.

## v0.4.0 - WordPress Runtime Testing

Focus:

- add WordPress runtime smoke tests;
- add WordPress Playground blueprint;
- add screenshot/manual review workflow for admin/editor/frontend;
- explore browser-based visual checks only if infrastructure stays lightweight.

Suggested issues:

- Add screenshot-based admin UI review example.
- Add WordPress Playground compatibility demo.
- Add rendered SEO output validation workflow.

## Roadmap Issue Body

Title:

```text
Roadmap: WordPress Plugin Dev Skill v0.2.0-v0.4.0
```

Body:

```markdown
This project is an early but validated Agent Skill for WordPress plugin development.

Already validated:

- canonical skill structure;
- synced Codex/Claude/Cursor install targets;
- local validation and smoke checks;
- fixture-based security, performance, design, and compatibility audit outputs;
- lightweight GitHub Actions workflow.

Not claimed yet:

- broad production adoption;
- universal theme/plugin compatibility;
- runtime WordPress test coverage;
- exhaustive security/performance/design scanner coverage.

Planned hardening:

- stronger Composer/PHP checks;
- real compatibility matrix entries with exact versions;
- WordPress runtime smoke tests;
- Playground demos;
- better false-positive handling;
- richer examples and fixtures.

Contributors are welcome to pick a good-first issue or propose a focused verification scenario.
```

