#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"

node "$ROOT/skills/wordpress-plugin-dev/scripts/validate-skill.mjs"
node "$ROOT/skills/wordpress-plugin-dev/scripts/check-source-map.mjs"
node "$ROOT/skills/wordpress-plugin-dev/scripts/audit-plugin.mjs" "$ROOT/skills/wordpress-plugin-dev/fixtures/demo-plugin"
