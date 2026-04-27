# GitHub Manual Actions

These steps improve public repository presentation without faking adoption or maturity.

Status on 2026-04-26: About metadata, topics, homepage, initial labels, starter issues, roadmap issue, and release `v0.1.0` were completed with `gh`. On 2026-04-27, hardening labels, milestones, and additional starter issues were created with `gh` after escalating access to the local GitHub CLI credentials.

## Repository About

Set description:

```text
Professional Agent Skill for building, auditing, testing, and releasing modern WordPress plugins with Codex, Cursor, and Claude Code.
```

Suggested homepage:

```text
https://github.com/Zulut30/Wordpress-skills/blob/main/docs/demo.md
```

Suggested topics:

```text
wordpress
wordpress-plugin
ai-agent
agent-skills
cursor
claude-code
codex
plugin-security
gutenberg
block-editor
wp-cli
wordpress-security
php
javascript
developer-tools
```

## Release

Published `v0.1.0` using [docs/reports/RELEASE_SUMMARY_V0.1.0.md](reports/RELEASE_SUMMARY_V0.1.0.md) as the source for release notes.

Suggested release title:

```text
v0.1.0 - Initial WordPress Plugin Dev Skill
```

Attach release artifacts after running:

```bash
npm run package:skill
```

Upload:

- `packages/wordpress-plugin-dev-skill-v0.1.0.tar.gz`
- `packages/wordpress-plugin-dev-skill-v0.1.0.tar.gz.sha256`

## Community

- Labels from [starter issues](starter-issues.md) were created.
- The five prepared starter issues were opened.
- A roadmap issue titled `Roadmap: WordPress Plugin Dev Skill v0.2.0-v0.4.0` is open.
- Pin the roadmap issue manually if it should stay visible.
- Optionally enable GitHub Discussions if maintainers plan to respond.
- Enable private vulnerability reporting if available.

## Hardening Follow-Up

Created; verify these labels if the repository is recreated:

```text
good first issue
help wanted
documentation
testing
enhancement
wordpress
compatibility
ci
```

Created; verify these milestones if the repository is recreated:

- `v0.2.0 - Hardening and CI`
- `v0.3.0 - Compatibility Verification`
- `v0.4.0 - WordPress Runtime Testing`

Created; verify the starter issues in [starter-issues.md](starter-issues.md), then pin the roadmap issue from [roadmap-milestones.md](roadmap-milestones.md) if the repository needs a visible collaboration entry.

## Pinned Items

- Pin the roadmap issue.
- Pin the latest release if it helps visitors install a versioned package.
- Keep [docs/demo.md](demo.md) linked from the README proof/demo sections.

## Optional Project Board

Create a lightweight GitHub Project only if maintainers will use it. Suggested columns:

- Backlog
- Ready
- In progress
- Needs review
- Done

## Promotion Readiness

- Share the text demo and audit outputs after the first release exists.
- Ask WordPress developers for review before promoting broadly.
- Do not claim production adoption until real users report it.
