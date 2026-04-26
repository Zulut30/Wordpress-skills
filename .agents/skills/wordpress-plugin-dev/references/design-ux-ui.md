# Design, UX, and UI for WordPress Plugins

Last reviewed: 2026-04-27

## Purpose

Use this reference when an agent designs, reviews, or implements WordPress plugin UI. It helps with:

- clear plugin admin screens, dashboards, settings pages, and onboarding;
- WordPress-native UI that fits wp-admin instead of fighting it;
- Gutenberg block editor UI, toolbar/sidebar decisions, and placeholders;
- frontend block, shortcode, and widget output that respects the active theme;
- UI audits covering accessibility, responsiveness, RTL, i18n, performance, and security;
- practical implementation plans for better empty, loading, success, error, and edge states.

This guide does not replace manual visual review, keyboard testing, or assistive-technology checks.

## Core Principles

1. Fit into WordPress before inventing a new visual language.
2. Solve user tasks, not just layout screens.
3. Reduce cognitive load.
4. Use progressive disclosure.
5. Prefer native WordPress components and admin patterns.
6. Respect user roles, capabilities, and context.
7. Make important actions obvious and destructive actions safe.
8. Design every screen with empty, loading, success, error, and edge states.
9. Accessibility is part of design, not a final pass.
10. Keep admin UI fast and scoped.
11. Frontend output should inherit from the active theme where possible.
12. Do not sacrifice security, i18n, or performance for visual polish.

## Official Sources

- Title: Make WordPress Design Handbook
- Official URL: https://make.wordpress.org/design/handbook/
- What to use it for: WordPress ecosystem design orientation, foundations, visual/interface design, and inclusive design context.
- When to verify online: Before claiming current WordPress design-system direction, colors, typography, iconography, or team guidance.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Use as design context. Do not copy visual language wholesale into plugins, and do not use WordPress marks as plugin branding.

- Title: `@wordpress/admin-ui`
- Official URL: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-admin-ui/
- What to use it for: Consistent admin page layout primitives such as high-level page, navigation, and sidebar structures.
- When to verify online: Before adopting it in production, because the package is newer and package status/API can change.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Consider it for React admin apps that need WordPress-like structure; for classic settings pages, Settings API plus `.wrap` may be simpler.

- Title: Component Reference / `@wordpress/components`
- Official URL: https://developer.wordpress.org/block-editor/reference-guides/components/
- What to use it for: Editor/admin UI controls such as Button, Notice, TextControl, ToggleControl, SelectControl, Placeholder, PanelBody, Modal, Spinner, and ToolbarButton.
- When to verify online: Before using a component prop, newer component, or behavior not already present in the target project.
- Last reviewed: 2026-04-27
- Notes for agent behavior: This is the safer default package for many editor and React admin UI controls.

- Title: `@wordpress/ui`
- Official URL: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-ui/
- What to use it for: Low-level UI primitives when building custom Gutenberg/admin UI.
- When to verify online: Always verify before production use. Treat this package as evolving and do not assume it is the right default.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Prefer `@wordpress/components` unless the project already uses `@wordpress/ui` or the current docs make the choice clear.

- Title: Block Design
- Official URL: https://developer.wordpress.org/block-editor/explanations/user-interface/block-design/
- What to use it for: Block design decisions, block controls, canvas/sidebar balance, and editor user experience.
- When to verify online: Before making Gutenberg UI claims or when editor UI APIs/patterns may have changed.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Design the block around the content task. Do not dump every option into InspectorControls.

- Title: Block Editor Accessibility
- Official URL: https://developer.wordpress.org/block-editor/how-to-guides/accessibility/
- What to use it for: Accessibility guidance for Gutenberg and editor extensions.
- When to verify online: Before implementing complex editor interactions, landmarks, modals, keyboard behavior, or dynamic updates.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Use semantic HTML and core components first; add ARIA only when it improves an actual interaction.

- Title: `@wordpress/a11y`
- Official URL: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-a11y/
- What to use it for: Spoken messages and accessibility helpers for dynamic UI updates.
- When to verify online: Before adding screen-reader announcements or package imports.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Announce meaningful async changes, not every decorative update.

- Title: Block Editor Handbook
- Official URL: https://developer.wordpress.org/block-editor/
- What to use it for: Block editor concepts, package references, editor extensions, block supports, and UI patterns.
- When to verify online: Before implementing editor UI, slotfills, block supports, or package-specific APIs.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Use this as the table of contents, then route to specific package or block UI docs.

- Title: Administration Menus
- Official URL: https://developer.wordpress.org/plugins/administration-menus/
- What to use it for: Admin menu and submenu placement, capability arguments, and admin screen registration.
- When to verify online: Before adding top-level menus or changing admin navigation.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Avoid unnecessary top-level menus. Match menu capability to what the screen actually manages.

- Title: Settings API
- Official URL: https://developer.wordpress.org/plugins/settings/settings-api/
- What to use it for: WordPress-native settings registration, sections, fields, forms, nonce flow, and sanitization callbacks.
- When to verify online: Before implementing settings screens or changing option storage.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Settings UI design must preserve sanitize callbacks, capability checks, and safe save feedback.

- Title: HTML Coding Standards
- Official URL: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/html/
- What to use it for: WordPress HTML style, semantic markup expectations, and maintainable templates.
- When to verify online: Before reviewing HTML style or making standards claims.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Semantics and escaping matter more than decorative markup.

- Title: CSS Coding Standards
- Official URL: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/
- What to use it for: CSS formatting, selector quality, admin CSS cautions, media queries, and maintainability.
- When to verify online: Before adding lint/style rules or reviewing CSS standards.
- Last reviewed: 2026-04-27
- Notes for agent behavior: Scope plugin CSS. Avoid broad wp-admin or theme-global overrides.

- Title: Internationalization
- Official URL: https://developer.wordpress.org/apis/internationalization/
- What to use it for: PHP and JavaScript translation APIs, text domains, translator comments, and text expansion considerations.
- When to verify online: Before changing text domain, JS i18n setup, or translation workflow.
- Last reviewed: 2026-04-27
- Notes for agent behavior: All generated UI text should be translation-ready.

## Design Audit Workflow

1. Identify UI type:
   - admin settings page;
   - admin dashboard;
   - list/table management screen;
   - onboarding/setup wizard;
   - Gutenberg block editor UI;
   - block sidebar/toolbar controls;
   - frontend block output;
   - shortcode output;
   - widget output;
   - REST-powered app-like UI;
   - notices/error states.
2. Identify user:
   - site owner;
   - admin;
   - editor;
   - author;
   - developer;
   - store manager;
   - support/admin operator;
   - anonymous frontend visitor.
3. Identify main tasks:
   - configure;
   - monitor;
   - create;
   - edit;
   - import/export;
   - troubleshoot;
   - review status;
   - complete setup;
   - recover from error.
4. Inspect:
   - information architecture;
   - visual hierarchy;
   - form layout;
   - labels/help text;
   - field grouping;
   - buttons/actions;
   - notices;
   - empty states;
   - loading states;
   - error states;
   - responsive behavior;
   - keyboard navigation;
   - focus management;
   - color contrast;
   - RTL readiness;
   - i18n and text expansion;
   - performance of UI assets;
   - security of forms/actions.
5. Classify findings:
   - UX blocker;
   - accessibility blocker;
   - high;
   - medium;
   - low;
   - visual polish.
6. Produce:
   - design audit report;
   - prioritized improvements;
   - before/after implementation plan;
   - safe rollout plan;
   - testing checklist.

## Admin UI Principles

### Layout

- Use existing WordPress admin structure.
- Use `.wrap` for classic admin pages.
- Keep page title, description, primary action, and status clear.
- Put critical information above the fold.
- Avoid dashboard clutter.
- Keep width readable.
- Avoid custom full-screen SaaS UI unless justified.

### Navigation

- Avoid unnecessary top-level admin menus.
- Use submenu pages when the feature belongs under Settings, Tools, WooCommerce, or another parent.
- Keep tabs meaningful and few.
- Use breadcrumbs only when they reduce confusion.
- Preserve browser/back behavior where possible.

### Settings Pages

- Group settings by user task, not internal data structure.
- Use clear labels.
- Use help text for consequences, not obvious repetition.
- Use defaults that are safe and useful.
- Avoid giant forms with dozens of unrelated fields.
- Show save status clearly.
- Warn before destructive changes.
- Use nonces and capability checks.

### Forms

- Labels must be explicit and connected to controls.
- Use fieldsets/legends for groups.
- Required fields should be clear.
- Validation errors should be close to the field and summarized if needed.
- Do not rely on placeholder text as the only label.
- Do not use color alone to communicate state.
- Support keyboard navigation and focus states.

### Actions And Buttons

- One primary action per screen/section where possible.
- Destructive actions should be visually and semantically distinct.
- Use confirmation for irreversible actions.
- Avoid vague labels like "Submit".
- Prefer action labels like "Save settings", "Connect account", or "Regenerate cache".

### Notices

- Use notices sparingly.
- Make messages actionable.
- Use success/error/warning/info appropriately.
- Avoid permanent dismissible notices that return unexpectedly.
- For dynamic JS updates, announce important changes to screen readers.

### Empty States

- Explain what is missing.
- Explain why it matters.
- Offer the next best action.
- Avoid blaming the user.
- Keep empty states short.

### Loading States

- Show progress for slow operations.
- Disable double-submit where needed.
- Avoid fake progress if unknown.
- Use skeletons/spinners only when helpful.
- Keep long-running operations asynchronous where possible.

### Error States

- Explain what happened.
- Explain what the user can do next.
- Avoid exposing secrets or raw stack traces.
- Preserve user input when possible.
- Provide retry/reconnect options when appropriate.

## Gutenberg/Block UI Principles

- Canvas is the primary interface for block content.
- Toolbar is for important contextual actions.
- Sidebar/InspectorControls are for advanced or tertiary settings.
- Do not overload inspector panels.
- Use good defaults.
- Use placeholders that teach the next step.
- Keep block selected/unselected states stable.
- Avoid controls that resize or jump the block unexpectedly.
- Use `@wordpress/components` for editor controls.
- Use i18n for UI text.
- Respect block supports.
- Support mobile/editor small viewports.
- Avoid heavy custom UI if core components solve the task.
- Keep frontend output close to editor preview where practical.
- Use `wp.a11y.speak` or `@wordpress/a11y` for meaningful dynamic updates where appropriate.

## Frontend Output Principles

- Frontend plugin output should usually inherit theme typography/colors/spacing.
- Scope CSS to a plugin wrapper/block class.
- Avoid global resets.
- Avoid hardcoded fonts unless the user explicitly configures branding.
- Use semantic HTML.
- Use accessible form controls.
- Use responsive CSS.
- Support RTL.
- Avoid layout shifts.
- Avoid huge frontend bundles.
- Do not inline user-provided styles without sanitization.
- Escape all output.
- Avoid breaking theme editor styles.
- Use block supports and `theme.json`-friendly patterns where relevant.

## Visual Design Checklist

- Hierarchy: can the user identify the page purpose and next action in a few seconds?
- Spacing: is related content grouped and unrelated content separated?
- Alignment: do forms, labels, and actions line up predictably?
- Typography: does text follow WordPress/admin scale instead of marketing-page scale?
- Color: is color meaningful, restrained, and not the only signal?
- Contrast: do custom colors meet accessibility expectations?
- Icon usage: are icons supportive and labeled when needed?
- Density: is the UI scannable without becoming sparse or card-heavy?
- Responsive layout: does it work in narrow admin/editor contexts?
- Consistency: does it feel native to WordPress?
- States: focus, hover, active, disabled, empty, loading, error, and success are accounted for.

## UX Writing / Microcopy

- Use clear labels.
- Use action-oriented button text.
- Write human-readable error messages.
- Avoid technical jargon unless the target user is technical.
- Explain consequences before irreversible actions.
- Add translator comments for placeholders or ambiguous terms.
- Avoid hardcoded English-only strings.
- Account for text expansion in translations.

## Accessibility Checklist

- Keyboard-only operation.
- Visible focus.
- Semantic headings.
- Correct label associations.
- Fieldsets and legends.
- ARIA only when needed.
- Live region announcements for meaningful dynamic updates.
- Color contrast.
- Reduced motion.
- No color-only meaning.
- Avoid unnecessary modals.
- Modal focus trap and focus return if a modal is used.
- Screen-reader-friendly errors.
- Responsive/mobile admin usability.

## RTL And Localization Checklist

- Avoid left/right assumptions where logical CSS properties work.
- Avoid text inside images.
- Allow longer translated labels.
- Use WordPress i18n functions.
- Use `is_rtl()` or RTL styles only when necessary.
- Test common UI with long strings.

## Security/Performance Design Intersection

- Design forms with nonce/capability flow in mind.
- Do not hide security-critical status.
- Do not make destructive actions too easy.
- Do not load admin UI assets globally.
- Do not fetch large datasets just to render a pretty dashboard.
- Paginate tables and cards.
- Do not expose private data in frontend widgets.
- Do not cache user-specific UI globally.

## Design Review Checklist

### Must Fix

- Missing labels.
- Inaccessible forms.
- No focus states.
- No error states.
- Destructive actions without confirmation.
- Global admin CSS breaking WordPress UI.
- Frontend output not escaped.
- Plugin UI loaded everywhere.
- Impossible keyboard operation.
- Poor contrast.
- No mobile/responsive behavior for important UI.
- Settings page with unclear save/status behavior.

### Should Fix

- Too many top-level menus.
- Unclear grouping.
- Vague button text.
- No empty/loading states.
- Overloaded inspector sidebar.
- Inconsistent spacing.
- Too much custom styling in wp-admin.
- No RTL consideration.
- No text expansion consideration.

### Nice To Have

- Design tokens.
- Documented UI patterns.
- Before/after screenshots.
- Figma mockup.
- Usability notes.
- Richer component examples.
- Visual regression tests.

## Agent Response Format

```text
Executive summary
- One paragraph on the current UI state, user impact, and priority.

UI type and target user
- Admin settings page / block editor UI / frontend shortcode / dashboard.
- Primary user: site owner, admin, editor, visitor, etc.

Main user tasks
- What the user is trying to accomplish.

UX blockers
- Highest-impact task-flow problems first.

Accessibility blockers
- Labels, keyboard, focus, contrast, live updates, semantic structure.

Visual/design issues
- Hierarchy, spacing, grouping, density, responsive behavior.

WordPress-native improvements
- Admin patterns, Settings API, @wordpress/components, block supports, notices.

Recommended component patterns
- Specific PHP/JS/CSS patterns and templates to use.

File references
- File and line references where possible.

Before/after plan
- Minimal safe changes before broader redesign.

Implementation steps
- Small patches ordered by risk and user value.

Testing checklist
- Keyboard, screen reader spot check, mobile/narrow viewport, RTL/long strings, save/error states.

What needs manual visual review
- Anything a static scanner or code review cannot prove.
```
