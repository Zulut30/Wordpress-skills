#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SKILL_DIR="$ROOT/skills/wordpress-plugin-dev"

log() {
	printf '%s\n' "$*"
}

require_file() {
	if [ ! -f "$1" ]; then
		log "Missing required file: $1"
		exit 1
	fi
	log "OK: $1"
}

require_dir() {
	if [ ! -d "$1" ]; then
		log "Missing required directory: $1"
		exit 1
	fi
	log "OK: $1"
}

log "Smoke testing WordPress Plugin Dev skill"
log "Root: $ROOT"

require_file "$SKILL_DIR/SKILL.md"
require_dir "$SKILL_DIR/references"
require_dir "$SKILL_DIR/assets/templates"
require_dir "$SKILL_DIR/assets/examples"
require_dir "$SKILL_DIR/scripts"

references=(
	"source-map.md"
	"plugin-architecture.md"
	"wordpress-security.md"
	"coding-standards.md"
	"hooks-rest-admin.md"
	"blocks-gutenberg.md"
	"interactivity-api.md"
	"i18n-a11y-privacy.md"
	"testing-and-ci.md"
	"release-wordpress-org.md"
	"review-checklists.md"
	"performance-optimization.md"
	"design-ux-ui.md"
	"integrations-compatibility.md"
)

for reference in "${references[@]}"; do
	require_file "$SKILL_DIR/references/$reference"
done

require_file "$SKILL_DIR/assets/templates/github-actions-ci.yml.stub"
require_file "$SKILL_DIR/scripts/validate-skill.mjs"
require_file "$SKILL_DIR/scripts/check-source-map.mjs"
require_file "$SKILL_DIR/scripts/audit-plugin.mjs"
require_dir "$ROOT/test-fixtures/performance-plugin"
require_dir "$ROOT/test-fixtures/design-plugin"
require_dir "$ROOT/test-fixtures/compatibility-plugin"

if ! command -v node >/dev/null 2>&1; then
	log "Node.js is not available. Next step: install Node.js LTS, then run npm install or npm ci."
	exit 0
fi

if [ ! -f "$ROOT/package.json" ]; then
	log "No root package.json found. File and directory smoke checks passed."
	exit 0
fi

if [ ! -d "$ROOT/node_modules" ]; then
	log "Node dependencies are not installed. Next steps:"
	log "  npm ci"
	log "  npm run validate"
	log "  npm run check:sources"
	log "Skipping Node-based smoke checks for now."
	exit 0
fi

log "Running Node-based skill checks"
node "$SKILL_DIR/scripts/validate-skill.mjs"
node "$SKILL_DIR/scripts/check-source-map.mjs"

if [ -d "$SKILL_DIR/fixtures/demo-plugin" ]; then
	node "$SKILL_DIR/scripts/audit-plugin.mjs" "$SKILL_DIR/fixtures/demo-plugin"
else
	log "Fixture plugin missing. Next step: add fixtures/demo-plugin for audit smoke coverage."
fi

if [ -d "$ROOT/test-fixtures/performance-plugin" ]; then
	log "Running performance audit smoke check"
	node "$SKILL_DIR/scripts/audit-plugin.mjs" "$ROOT/test-fixtures/performance-plugin" --performance
	node "$SKILL_DIR/scripts/audit-plugin.mjs" "$ROOT/test-fixtures/performance-plugin" --performance --json >/tmp/wordpress-plugin-dev-performance-audit.json
	node -e "JSON.parse(require('fs').readFileSync('/tmp/wordpress-plugin-dev-performance-audit.json', 'utf8')); console.log('Performance JSON parsed.')"
else
	log "Performance fixture missing. Next step: add test-fixtures/performance-plugin."
fi

if [ -d "$ROOT/test-fixtures/design-plugin" ]; then
	log "Running design audit smoke check"
	node "$SKILL_DIR/scripts/audit-plugin.mjs" "$ROOT/test-fixtures/design-plugin" --design
	node "$SKILL_DIR/scripts/audit-plugin.mjs" "$ROOT/test-fixtures/design-plugin" --design --json >/tmp/wordpress-plugin-dev-design-audit.json
	node -e "JSON.parse(require('fs').readFileSync('/tmp/wordpress-plugin-dev-design-audit.json', 'utf8')); console.log('Design JSON parsed.')"
else
	log "Design fixture missing. Next step: add test-fixtures/design-plugin."
fi

if [ -d "$ROOT/test-fixtures/compatibility-plugin" ]; then
	log "Running compatibility audit smoke check"
	node "$SKILL_DIR/scripts/audit-plugin.mjs" "$ROOT/test-fixtures/compatibility-plugin" --compatibility
	node "$SKILL_DIR/scripts/audit-plugin.mjs" "$ROOT/test-fixtures/compatibility-plugin" --compatibility --json >/tmp/wordpress-plugin-dev-compatibility-audit.json
	node -e "JSON.parse(require('fs').readFileSync('/tmp/wordpress-plugin-dev-compatibility-audit.json', 'utf8')); console.log('Compatibility JSON parsed.')"
else
	log "Compatibility fixture missing. Next step: add test-fixtures/compatibility-plugin."
fi

log "Smoke test passed."
