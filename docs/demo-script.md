# Demo Script

Use this script for a terminal recording or a live walkthrough.

## Setup

```bash
git clone https://github.com/Zulut30/Wordpress-skills.git
cd Wordpress-skills
npm install
```

## Validate the skill package

```bash
npm run validate:skill
npm run smoke
```

Expected result:

```text
Skill validation passed.
Smoke test passed.
```

## Audit the sample plugin

```bash
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin
```

Expected result:

```text
Findings: 1 error, 2 warning, 1 info
unsafe-example.php
```

The non-zero exit code is expected because the fixture intentionally includes unsafe examples for scanner validation.

## JSON output

```bash
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/sample-plugin --json
```

Use this mode when another tool or CI job needs structured results.

## Audit specialized fixtures

```bash
npm run performance:audit
npm run design:audit
npm run compatibility:audit
```

Expected result: each command prints a human-readable report with warning/info findings from fixture-only examples.

Show structured output:

```bash
npm run performance:audit:json
npm run design:audit:json
npm run compatibility:audit:json
```

## Show proof links

Open the README proof section and the generated examples:

```text
docs/examples/audit-sample-human.md
docs/examples/performance-audit-human.md
docs/examples/design-audit-human.md
docs/examples/compatibility-audit-human.md
```
