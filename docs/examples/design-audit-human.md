# Design Audit Human Output

Command:

```bash
node skills/wordpress-plugin-dev/scripts/audit-plugin.mjs test-fixtures/design-plugin --design
```

Representative output, with the local workspace path normalized:

```text
WordPress Plugin Audit
Target: test-fixtures/design-plugin
Limitation: This is a heuristic scanner for agent review triage, not a security, performance, accessibility, or design oracle. It can miss issues and produce false positives; verify findings manually against current WordPress docs, profiling, and real UI review.

Summary:
- Main plugin file: design-plugin.php
- PHP files scanned: 5
- block.json files scanned: 2
- Design findings: 35
- Findings: 0 error, 18 warning, 17 info

Findings:
- [WARNING] assets/bad-admin.css:4 design.admin.global-css-selector
  Admin stylesheet contains a broad/global selector.
  Why it matters: Plugin admin CSS should not override unrelated WordPress admin screens.
  Remediation: Scope selectors under the plugin admin root class.
  Confidence: medium
- [WARNING] assets/bad-admin.css:8 design.admin.global-css-selector
  Admin stylesheet contains a broad/global selector.
  Why it matters: Plugin admin CSS should not override unrelated WordPress admin screens.
  Remediation: Scope selectors under the plugin admin root class.
  Confidence: medium
- [WARNING] assets/bad-admin.css:13 design.css.removes-focus-without-replacement
  CSS removes outline without an obvious replacement focus style.
  Why it matters: Visible focus is required for keyboard users.
  Remediation: Add a strong :focus or :focus-visible style when removing the browser default.
  Confidence: high
- [WARNING] assets/bad-frontend.css:4 design.frontend.global-css-selector
  Frontend stylesheet contains a broad global selector.
  Why it matters: Plugin frontend CSS should not override theme typography, spacing, or controls globally.
  Remediation: Scope selectors under the plugin wrapper or block class.
  Confidence: medium
- [WARNING] assets/bad-frontend.css:8 design.frontend.global-css-selector
  Frontend stylesheet contains a broad global selector.
  Why it matters: Plugin frontend CSS should not override theme typography, spacing, or controls globally.
  Remediation: Scope selectors under the plugin wrapper or block class.
  Confidence: medium
- [WARNING] blocks/bad-block/edit.js:1 design.blocks.overloaded-inspector-controls
  Block editor file contains many inspector controls (11).
  Why it matters: Overloaded sidebars hide the primary editing task and increase cognitive load.
  Remediation: Move primary content controls onto the canvas, group advanced settings, and remove controls that can use block supports.
  Confidence: medium
- [WARNING] blocks/bad-block/edit.js:18 design.blocks.control-without-label
  Block editor control has no obvious label prop.
  Why it matters: Editor controls need labels for usability, accessibility, and translation context.
  Remediation: Add a concise translatable label prop.
  Confidence: medium
- [WARNING] blocks/bad-block/edit.js:19 design.blocks.control-without-label
  Block editor control has no obvious label prop.
  Why it matters: Editor controls need labels for usability, accessibility, and translation context.
  Remediation: Add a concise translatable label prop.
  Confidence: medium
- [WARNING] blocks/bad-block/edit.js:20 design.blocks.control-without-label
  Block editor control has no obvious label prop.
  Why it matters: Editor controls need labels for usability, accessibility, and translation context.
  Remediation: Add a concise translatable label prop.
  Confidence: medium
- [WARNING] blocks/bad-block/edit.js:21 design.blocks.control-without-label
  Block editor control has no obvious label prop.
  Why it matters: Editor controls need labels for usability, accessibility, and translation context.
  Remediation: Add a concise translatable label prop.
  Confidence: medium
- [WARNING] src/BadAdminPage.php:12 design.admin.assets-not-screen-scoped
  Admin assets are enqueued without an obvious screen check.
  Why it matters: Unscoped admin CSS/JS can alter unrelated WordPress screens and slow the admin experience.
  Remediation: Gate admin assets by $hook_suffix or get_current_screen()->id.
  Confidence: medium
- [WARNING] src/BadAdminPage.php:36 design.admin.form-without-obvious-nonce-flow
  Admin form has no obvious Settings API or nonce flow.
  Why it matters: Good UI must preserve secure save behavior and clear state-changing intent.
  Remediation: Use Settings API with settings_fields() or add wp_nonce_field() plus a capability and nonce check in the handler.
  Confidence: medium
- [WARNING] src/BadAdminPage.php:37 design.forms.control-without-label
  Form control has no obvious label or accessible name nearby.
  Why it matters: Controls without names are difficult or impossible to use with assistive technology.
  Remediation: Add a visible <label for="..."> or a justified aria-label/aria-labelledby association.
  Confidence: medium
- [WARNING] src/BadAdminPage.php:37 design.forms.placeholder-used-as-label
  Placeholder appears to be used without a real label.
  Why it matters: Placeholder text disappears as users type and is not a reliable accessible name.
  Remediation: Keep the placeholder optional and add a persistent visible label.
  Confidence: medium
- [WARNING] src/BadAdminPage.php:38 design.forms.control-without-label
  Form control has no obvious label or accessible name nearby.
  Why it matters: Controls without names are difficult or impossible to use with assistive technology.
  Remediation: Add a visible <label for="..."> or a justified aria-label/aria-labelledby association.
  Confidence: medium
- [WARNING] src/BadFrontendOutput.php:15 design.forms.control-without-label
  Form control has no obvious label or accessible name nearby.
  Why it matters: Controls without names are difficult or impossible to use with assistive technology.
  Remediation: Add a visible <label for="..."> or a justified aria-label/aria-labelledby association.
  Confidence: medium
- [WARNING] src/BadFrontendOutput.php:15 design.forms.placeholder-used-as-label
  Placeholder appears to be used without a real label.
  Why it matters: Placeholder text disappears as users type and is not a reliable accessible name.
  Remediation: Keep the placeholder optional and add a persistent visible label.
  Confidence: medium
- [WARNING] src/BadFrontendOutput.php:15 design.frontend.form-without-labels
  Frontend form has no obvious labels or accessible names.
  Why it matters: Public forms must be understandable to keyboard and screen-reader users.
  Remediation: Add labels, descriptions, error states, and semantic form structure.
  Confidence: medium
- [INFO] assets/bad-admin.css:1 design.css.motion-without-reduced-motion
  Stylesheet uses animation/transition without a prefers-reduced-motion branch.
  Why it matters: Some users prefer reduced motion, and admin UI should respect that preference.
  Remediation: Add a @media (prefers-reduced-motion: reduce) override when motion is not essential.
  Confidence: low
- [INFO] assets/bad-admin.css:17 design.css.fixed-width-review
  CSS uses a fixed pixel width.
  Why it matters: Fixed widths can break mobile admin, narrow editor sidebars, or theme layouts.
  Remediation: Use max-width, minmax(), flex/grid, or responsive constraints where possible.
  Confidence: low
- [INFO] assets/bad-admin.css:18 design.css.physical-direction-property
  CSS uses physical left/right properties.
  Why it matters: Physical direction assumptions can make RTL layouts harder to support.
  Remediation: Prefer logical properties such as margin-inline-start, inset-inline-end, or text-align: start where practical.
  Confidence: low
- [INFO] assets/bad-frontend.css:5 design.frontend.hardcoded-font-family
  Frontend CSS sets a font family.
  Why it matters: Plugin output should usually inherit the active theme typography unless branding is explicitly configured.
  Remediation: Remove the hardcoded font-family or make it an opt-in branded setting.
  Confidence: low
- [INFO] assets/bad-frontend.css:13 design.css.fixed-width-review
  CSS uses a fixed pixel width.
  Why it matters: Fixed widths can break mobile admin, narrow editor sidebars, or theme layouts.
  Remediation: Use max-width, minmax(), flex/grid, or responsive constraints where possible.
  Confidence: low
- [INFO] assets/bad-frontend.css:14 design.css.physical-direction-property
  CSS uses physical left/right properties.
  Why it matters: Physical direction assumptions can make RTL layouts harder to support.
  Remediation: Prefer logical properties such as margin-inline-start, inset-inline-end, or text-align: start where practical.
  Confidence: low
- [INFO] blocks/bad-block/edit.js:1 design.blocks.no-obvious-placeholder
  Block edit UI has no obvious Placeholder component.
  Why it matters: Blocks that require setup should explain the next step before content exists.
  Remediation: Add a concise Placeholder with a primary setup action when the block starts empty or disconnected.
  Confidence: low
- [INFO] blocks/bad-block/edit.js:11 design.blocks.editor-string-not-i18n
  Editor UI string is not obviously wrapped in @wordpress/i18n.
  Why it matters: Block editor UI text should be translation-ready.
  Remediation: Wrap strings with __(), _x(), or related @wordpress/i18n helpers and use the plugin text domain.
  Confidence: low
- [INFO] blocks/bad-block/edit.js:17 design.blocks.editor-string-not-i18n
  Editor UI string is not obviously wrapped in @wordpress/i18n.
  Why it matters: Block editor UI text should be translation-ready.
  Remediation: Wrap strings with __(), _x(), or related @wordpress/i18n helpers and use the plugin text domain.
  Confidence: low
- [INFO] blocks/bad-block/edit.js:24 design.blocks.toolbar-button-without-label
  ToolbarButton has no obvious accessible label/title.
  Why it matters: Icon-only toolbar controls need accessible names.
  Remediation: Add a translatable label/title or aria-label that names the action.
  Confidence: low
- [INFO] src/BadAdminPage.php:1 design.admin.missing-page-heading
  Admin UI file has no obvious page h1.
  Why it matters: A clear page heading anchors the screen for visual, keyboard, and screen-reader users.
  Remediation: Add one escaped, translatable <h1> that describes the current admin screen.
  Confidence: low
- [INFO] src/BadAdminPage.php:16 design.admin.top-level-menu-review
  Plugin registers a top-level admin menu.
  Why it matters: Top-level menus add navigation weight and should be reserved for primary plugin workflows.
  Remediation: Confirm the feature deserves top-level placement; otherwise prefer an appropriate submenu such as Settings, Tools, or a product-specific parent.
  Confidence: low
- [INFO] src/BadAdminPage.php:36 design.admin.page-without-wrap
  Admin page markup has no obvious .wrap container.
  Why it matters: Classic WordPress admin pages feel more native and inherit spacing when using the standard wrap structure.
  Remediation: Render the page inside <div class="wrap plugin-root-class"> unless a custom app shell is explicitly justified.
  Confidence: low
- [INFO] src/BadAdminPage.php:37 design.forms.required-field-not-explained
  Required field has no obvious visible or screen-reader explanation nearby.
  Why it matters: Users need to know which fields are required before submission.
  Remediation: Add text or screen-reader text that explains required fields and keep server-side validation.
  Confidence: low
- [INFO] src/BadAdminPage.php:38 design.forms.choice-group-without-fieldset
  Checkbox/radio control has no nearby fieldset/legend.
  Why it matters: Grouped choices need context so users understand what the selection controls.
  Remediation: Wrap related checkbox/radio controls in a fieldset with a concise legend.
  Confidence: low
- [INFO] src/BadAdminPage.php:39 design.admin.vague-action-label
  Action label is vague.
  Why it matters: Specific button text reduces mistakes and helps users predict what will happen.
  Remediation: Use task-specific labels such as Save settings, Connect account, Regenerate cache, or Import items.
  Confidence: low
- [INFO] src/BadAdminPage.php:40 design.forms.error-not-programmatically-associated
  Error message is not obviously associated with a field or live region.
  Why it matters: Users should be able to find and hear validation errors near the affected control.
  Remediation: Connect field errors with aria-describedby and use role="alert" or wp.a11y.speak() for dynamic errors when appropriate.
  Confidence: low
```

