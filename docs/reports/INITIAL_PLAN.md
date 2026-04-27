# WordPress Plugin Dev Skill Plan

Last updated: 2026-04-26

## Goal

Create a portable `wordpress-plugin-dev` Agent Skill for Codex, Cursor, and Claude Code. The skill will guide agents through modern WordPress plugin design, implementation, review, testing, and release workflows without copying official documentation wholesale.

## Current Workspace

- Working directory: `D:\wp-skill`
- Initial state: empty directory, not a git repository.
- Target repository: `https://github.com/Zulut30/Wordpress-skills.git`

## Design Principles

- Keep `SKILL.md` under 500 lines and focused on routing, workflows, and reference selection.
- Put detailed curated knowledge in `skills/wordpress-plugin-dev/references/`.
- Put repeatable checks in `skills/wordpress-plugin-dev/scripts/`.
- Put reusable starter material in `skills/wordpress-plugin-dev/assets/templates/`.
- Include a small fixture plugin for script and skill validation.
- Every reference file must include:
  - `Last reviewed: 2026-04-26`
  - Official source links
  - A short "Verify current docs first" note when behavior depends on tool or WordPress versions.
- Prefer official WordPress, WP-CLI, npm package, Composer, PHPUnit, and GitHub Actions sources in the source map.

## Final Directory Structure

```text
wordpress-plugin-dev-skill/
|-- README.md
|-- AGENTS.md
|-- LICENSE
|-- package.json
|-- composer.json
|-- PLAN.md
|-- skills/
|   `-- wordpress-plugin-dev/
|       |-- SKILL.md
|       |-- references/
|       |   |-- source-map.md
|       |   |-- plugin-architecture.md
|       |   |-- wordpress-security.md
|       |   |-- coding-standards.md
|       |   |-- hooks-rest-admin.md
|       |   |-- blocks-gutenberg.md
|       |   |-- interactivity-api.md
|       |   |-- i18n-a11y-privacy.md
|       |   |-- testing-and-ci.md
|       |   |-- release-wordpress-org.md
|       |   `-- review-checklists.md
|       |-- assets/
|       |   |-- templates/
|       |   |   |-- plugin-php-main.stub
|       |   |   |-- composer-json.stub
|       |   |   |-- package-json.stub
|       |   |   |-- block-json.stub
|       |   |   |-- rest-controller.stub
|       |   |   |-- settings-page.stub
|       |   |   |-- readme-txt.stub
|       |   |   `-- github-actions-ci.yml.stub
|       |   `-- examples/
|       |       |-- modern-plugin-tree.md
|       |       |-- secure-rest-route.md
|       |       |-- dynamic-block.md
|       |       `-- admin-settings-page.md
|       |-- fixtures/
|       |   `-- demo-plugin/
|       |       |-- demo-plugin.php
|       |       |-- readme.txt
|       |       |-- src/
|       |       |   |-- Plugin.php
|       |       |   |-- Rest/
|       |       |   |   `-- Demo_Controller.php
|       |       |   `-- Admin/
|       |       |       `-- Settings_Page.php
|       |       |-- blocks/
|       |       |   `-- demo-dynamic/
|       |       |       |-- block.json
|       |       |       `-- render.php
|       |       |-- composer.json
|       |       `-- package.json
|       `-- scripts/
|           |-- validate-skill.mjs
|           |-- audit-plugin.mjs
|           |-- sync-install-targets.mjs
|           |-- check-source-map.mjs
|           `-- smoke-test.sh
|-- .codex-plugin/
|   `-- plugin.json
|-- .agents/
|   |-- skills/
|   |   `-- wordpress-plugin-dev/
|   `-- plugins/
|       `-- marketplace.json
|-- .claude/
|   `-- skills/
|       `-- wordpress-plugin-dev/
`-- .cursor/
    `-- skills/
        `-- wordpress-plugin-dev/
```

## Implementation Stages

1. Create repository shell: root docs, metadata, package/composer files, license, plugin manifest.
2. Write compact `SKILL.md` with reference-loading rules and workflows.
3. Write curated reference files with official source map and version-sensitive verification notes.
4. Add reusable templates and short examples.
5. Add fixture demo plugin.
6. Add validation and audit scripts.
7. Create install target directories for Codex, Cursor, and Claude Code by syncing the canonical skill folder.
8. Run validation scripts and basic git checks.
9. Initialize git, commit, add remote, and push to GitHub.

## Risks

- WordPress, Gutenberg, Interactivity API, `@wordpress/scripts`, `@wordpress/env`, Plugin Check, and WP-CLI evolve. Mitigation: source map and "verify current docs first" workflow.
- AI agents may over-load too much context. Mitigation: concise `SKILL.md`, explicit reference selection table, and one-level references.
- Security advice can become stale or too generic. Mitigation: checklists emphasize capabilities, nonces, sanitization, escaping, REST permission callbacks, and official docs verification.
- Cross-agent install conventions differ. Mitigation: canonical skill in `skills/wordpress-plugin-dev/`; mirrored folders for `.agents`, `.claude`, and `.cursor`; install docs explain portability.
- GitHub push may need credentials or network approval. Mitigation: initialize locally first, then request/use approved push workflow if required.

## Acceptance Checks

- `skills/wordpress-plugin-dev/SKILL.md` is under 500 lines.
- All reference files include `Last reviewed` and official sources.
- `validate-skill.mjs` passes.
- `audit-plugin.mjs` can inspect the fixture plugin.
- `check-source-map.mjs` confirms references declare sources.
- Install docs cover Codex, Cursor, and Claude Code.
- Repository is committed and pushed to `Zulut30/Wordpress-skills`.
