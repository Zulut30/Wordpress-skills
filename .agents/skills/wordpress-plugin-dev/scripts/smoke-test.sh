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
)

for reference in "${references[@]}"; do
	require_file "$SKILL_DIR/references/$reference"
done

require_file "$SKILL_DIR/assets/templates/github-actions-ci.yml.stub"
require_file "$SKILL_DIR/scripts/validate-skill.mjs"
require_file "$SKILL_DIR/scripts/check-source-map.mjs"
require_file "$SKILL_DIR/scripts/audit-plugin.mjs"

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

log "Smoke test passed."
