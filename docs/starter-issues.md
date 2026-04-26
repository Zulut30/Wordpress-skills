# Starter Issues

If GitHub issues have not been created yet, use these prepared issues.

## Labels To Create

- `good first issue`
- `documentation`
- `enhancement`
- `testing`
- `help wanted`
- `agent-skill`

## Improve Placeholder Substitution Tests For Plugin Templates

Labels: `good first issue`, `testing`, `agent-skill`

Goal: add tests that render templates with sample placeholder values.

Files involved:

- `skills/wordpress-plugin-dev/assets/templates/`
- `skills/wordpress-plugin-dev/scripts/`

Acceptance criteria:

- Replace `{{PLUGIN_SLUG}}`, `{{PLUGIN_NAME}}`, `{{TEXT_DOMAIN}}`, `{{VENDOR_NAMESPACE}}`, and `{{PLUGIN_VERSION}}` with sample values.
- Parse JSON templates after substitution.
- Run `php -l` on PHP template output when PHP is available.
- Document unsupported cases.

## Add More Gutenberg Block Examples For Dynamic And Interactive Blocks

Labels: `documentation`, `enhancement`, `good first issue`

Goal: add concise examples that show modern block patterns without copying official docs.

Acceptance criteria:

- Add one dynamic block example with `block.json` and `render.php`.
- Add one Interactivity API example or note when advanced patterns need current-doc verification.
- Link examples from `references/blocks-gutenberg.md` or `references/interactivity-api.md`.

## Expand audit-plugin.mjs Security Heuristics For Nonce, Capability, And Escaping Checks

Labels: `enhancement`, `testing`, `help wanted`

Goal: improve scanner coverage while keeping output explicit about heuristic limits.

Acceptance criteria:

- Add focused rules with tests.
- Avoid noisy broad regex findings where possible.
- Include remediation text for each rule.
- Keep `--json` output stable.

## Add Stronger Fixture Coverage For REST, Admin Settings, AJAX, And Block Rendering

Labels: `testing`, `help wanted`

Goal: make scanner demos and tests more representative.

Acceptance criteria:

- Add safe and unsafe fixture cases.
- Mark unsafe files as fixture-only.
- Update docs/example outputs if scanner output changes.
- Keep fixtures small.

## Document Cursor Agent Skills Installation Workflows By Version

Labels: `documentation`, `help wanted`

Goal: replace version-dependent fallback wording with verified Cursor instructions where possible.

Acceptance criteria:

- Link official Cursor docs or in-app documentation.
- Document confirmed project-level or import workflows.
- Keep fallback instructions for users on older or different Cursor versions.
