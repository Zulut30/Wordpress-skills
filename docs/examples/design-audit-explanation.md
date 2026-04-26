# Design Audit Explanation

The design audit example uses `test-fixtures/design-plugin`, a small fixture plugin with paired good and intentionally weak UI examples. The weak examples are marked as fixtures and are meant only to exercise scanner rules.

Run it locally:

```bash
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/design-plugin --design
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/design-plugin --design --json
```

Expected findings include broad admin/frontend CSS selectors, missing form labels, placeholder-only fields, overloaded block inspector controls, hardcoded editor strings, unscoped admin assets, and CSS patterns that need RTL, focus, or responsive review.

The scanner is heuristic. It can identify common WordPress plugin UI smells, but it cannot fully judge visual quality, contrast, layout, responsiveness, real keyboard behavior, or usability. Use the findings as triage, then verify in a real WordPress admin, block editor, and frontend theme context.

Manual review should confirm:

- the UI feels native to WordPress where appropriate;
- labels, help text, notices, errors, and save states are clear;
- forms work with keyboard and assistive technology;
- admin/frontend CSS is scoped;
- UI text is translation-ready;
- design changes do not weaken security, performance, escaping, or capability checks.
