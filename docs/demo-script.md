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
