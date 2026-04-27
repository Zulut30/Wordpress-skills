# Installation

This project is distributed as a portable Agent Skill. The canonical skill folder is:

```text
skills/wordpress-plugin-dev/
```

Generated install targets are synchronized from that folder:

```text
.agents/skills/wordpress-plugin-dev/
.claude/skills/wordpress-plugin-dev/
.cursor/skills/wordpress-plugin-dev/
```

Edit the canonical folder only, then run:

```bash
npm run sync
```

## Codex

### Local skill folder

Copy or sync the canonical skill folder into a Codex-readable skill directory, then invoke it by name where supported:

```text
Use wordpress-plugin-dev to audit this plugin for WordPress.org readiness.
```

When slash or explicit skill invocation is supported:

```text
$wordpress-plugin-dev audit this plugin for security, performance, design, and compatibility risks.
```

### Plugin-style package

This repository includes:

```text
.codex-plugin/plugin.json
.agents/plugins/marketplace.json
```

Use those files for local Codex plugin testing. Verify current Codex plugin packaging docs before publishing to any marketplace or external registry.

## Claude Code

Project-level install target:

```text
.claude/skills/wordpress-plugin-dev/
```

Personal install target:

```text
~/.claude/skills/wordpress-plugin-dev/
```

Example invocation:

```text
/skill wordpress-plugin-dev review this REST controller for permission_callback, sanitization, escaping, and WP_Error handling.
```

Verify the current Claude Code skill docs before release-sensitive packaging.

## Cursor

Cursor supports Agent Skills / skill-style workflows, but install paths and UI can vary by version. This repository prepares:

```text
.cursor/skills/wordpress-plugin-dev/
```

If your Cursor version uses a different path or import UI, use the canonical skill folder and import it through Cursor's documented skill creation/import workflow.

Example invocation where supported:

```text
Use wordpress-plugin-dev to create a dynamic Gutenberg block registered with block.json and a server-side render.php.
```

## Versioned Package Install

Build a local release archive:

```bash
npm run package:skill
```

The archive is written to `packages/` and is intended to be attached to a GitHub release rather than committed to the repository. See [release and packaging](release-and-packaging.md).

