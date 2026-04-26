# WordPress Plugin Dev Skill

Portable Agent Skill for designing, building, reviewing, testing, and releasing modern WordPress plugins with Codex, Cursor, and Claude Code.

The canonical skill lives in:

```text
skills/wordpress-plugin-dev/
```

## Install

### Codex

Copy or sync the canonical folder into your Codex skills directory:

```bash
mkdir -p ~/.codex/skills
cp -R skills/wordpress-plugin-dev ~/.codex/skills/
```

If using this repository as a Codex plugin, keep `.codex-plugin/plugin.json` and install the repository through the Codex plugin flow.

### Cursor

Copy the skill folder into the project or user-level Cursor skills location used by your setup:

```bash
mkdir -p .cursor/skills
cp -R skills/wordpress-plugin-dev .cursor/skills/
```

### Claude Code

Copy the skill folder into the Claude Code skills location used by your project:

```bash
mkdir -p .claude/skills
cp -R skills/wordpress-plugin-dev .claude/skills/
```

## Repository Checks

```bash
npm run validate
npm run check:sources
npm run audit:fixture
```

## What Is Included

- Compact `SKILL.md` under 500 lines.
- Curated WordPress references with official source links.
- Static validation and audit scripts.
- Starter templates for plugin files, REST controllers, Settings API pages, blocks, and CI.
- Demo fixture plugin for smoke-testing the skill and scripts.

This repository summarizes official guidance in original wording and points agents to the official docs before using version-sensitive APIs.
