# Review Checklists

Last reviewed: 2026-04-26

## Official Sources

- Plugin Handbook: https://developer.wordpress.org/plugins/
- Plugin Security: https://developer.wordpress.org/plugins/security/
- Common APIs security: https://developer.wordpress.org/apis/security/
- Coding Standards: https://developer.wordpress.org/coding-standards/
- Block Editor Handbook: https://developer.wordpress.org/block-editor/
- REST API Handbook: https://developer.wordpress.org/rest-api/
- Accessibility Coding Standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/accessibility/
- Internationalization: https://developer.wordpress.org/plugins/internationalization/
- Plugin Check: https://wordpress.org/plugins/plugin-check/
- WordPress.org Plugin Directory: https://developer.wordpress.org/plugins/wordpress-org/

## Verify Current Docs First

For release, compatibility, Plugin Check, build-tooling, or repository-submission reviews, verify current official docs and tool output before declaring a plugin ready.

## How To Use These Workflows

Pick the workflow that matches the user's request, inspect only the relevant files first, and report findings in priority order. For code-review style responses, lead with bugs, security issues, release blockers, or missing tests before summarizing.

Severity guide:

- `P0`: active exploit, data loss, broken install/update, or public release blocker.
- `P1`: likely security vulnerability, permission bypass, fatal error, or broken primary workflow.
- `P2`: correctness, maintainability, accessibility, performance, or compatibility issue.
- `P3`: polish, docs, style, or future-hardening suggestion.

## Workflow: New Plugin Architecture Review

### When To Use

Use when reviewing a new plugin skeleton, a large refactor, a plugin before feature work, or a codebase that lacks clear boundaries.

### Files To Inspect

- Main plugin file, usually `plugin-slug.php`.
- `src/`, `includes/`, `vendor/`, autoload configuration, and bootstrap classes.
- `composer.json`, `package.json`, build config, and namespace declarations.
- Activation, deactivation, uninstall, migration, and upgrade handlers.
- Admin, REST, block, cron, shortcode, privacy, and storage entry points.

### Questions To Ask

- Is the plugin small enough for one main file, or does it need service classes?
- Does the bootstrap do only loading, constants, lifecycle hooks, and service registration?
- Are namespaced classes and Composer autoloading used consistently when the plugin is modular?
- Are WordPress APIs used before custom abstractions or direct database writes?
- Are plugin boundaries clear enough that a future feature can be added without editing unrelated surfaces?

### Must-Pass Checks

- Main plugin file has a valid header, `ABSPATH` guard, version, text domain, and lifecycle hooks when needed.
- No global function/class names are likely to collide unless intentionally prefixed.
- Activation/deactivation handlers do not run expensive work on every request.
- Uninstall behavior is explicit and does not delete data unexpectedly.
- Dependencies and generated assets are accounted for in release packaging.

### Common Fixes

- Move business logic out of the main plugin file into namespaced service classes.
- Add Composer PSR-4 autoloading for `src/`.
- Replace global state with explicit registration methods.
- Split admin, REST, block, cron, and storage concerns into separate classes.
- Move schema creation or rewrite flushing to activation or upgrade routines.

### Example Final Response Format For The Agent

```text
Findings
- [P1] Main bootstrap performs database migration on every request in plugin-slug.php:42.
- [P2] REST and admin registration are mixed in the same class, making capability checks harder to audit.

Architecture Summary
The plugin is close to a modular shape, but the bootstrap needs to become thinner and lifecycle work needs to move out of normal requests.

Recommended Next Steps
1. Add a Plugin service container or registry.
2. Move migration logic behind activation/version upgrade checks.
3. Add a release packaging check for vendor/build files.
```

## Workflow: Security Review

### When To Use

Use for explicit security audits, pre-release reviews, PR reviews touching request handling, or any plugin that writes options, meta, files, database rows, or external requests.

### Files To Inspect

- REST controllers, AJAX handlers, admin POST handlers, shortcode callbacks, and block render files.
- Code reading `$_GET`, `$_POST`, `$_REQUEST`, `$_COOKIE`, `php://input`, uploaded files, or external webhooks.
- SQL queries, filesystem operations, HTTP API calls, cron callbacks, and option/meta writes.
- Templates, admin views, frontend render callbacks, and JavaScript that injects HTML.

### Questions To Ask

- Who can trigger this code path, and what capability should be required?
- Is the nonce protecting user intent, and is authorization checked separately?
- Is every input validated and sanitized before use or storage?
- Is every output escaped late for HTML, attribute, URL, JS, or allowed-HTML context?
- Can an attacker access another user's object, upload/delete arbitrary files, trigger SSRF, or leak private data?

### Must-Pass Checks

- State-changing browser/admin actions require capability checks and nonce verification.
- REST routes have `permission_callback`; public routes use `__return_true` only for genuinely public data.
- SQL with variables uses `$wpdb->prepare()` or safe WordPress APIs.
- File paths are constrained to expected directories and uploads validate MIME/type/extension.
- External HTTP requests have allowlists, timeouts, error handling, and no private-data leakage.

### Common Fixes

- Add `current_user_can()` checks closest to the operation.
- Add `check_admin_referer()` or `check_ajax_referer()` for admin/admin-ajax requests.
- Add REST arg schemas, `validate_callback`, and `sanitize_callback`.
- Replace raw output with `esc_html()`, `esc_attr()`, `esc_url()`, or `wp_kses_post()`.
- Replace manual SQL with WordPress APIs or prepared queries.

### Example Final Response Format For The Agent

```text
Security Findings
- [P1] Missing permission_callback exposes private settings through REST in src/Rest/Settings_Controller.php:61.
- [P1] Admin POST handler verifies a nonce but never checks current_user_can() in src/Admin/Save.php:28.
- [P2] Shortcode output prints user-controlled attributes without escaping in includes/shortcodes.php:44.

Residual Risk
The scanner/review is heuristic. I did not execute a full authenticated browser test.

Fix Plan
Add capability gates, REST arg validation, and late escaping before merging.
```

## Workflow: Gutenberg Block Review

### When To Use

Use when adding or reviewing static blocks, dynamic blocks, block variations, block supports, editor UI, Interactivity API behavior, or block build changes.

### Files To Inspect

- `blocks/**/block.json`, `src/edit.*`, `src/save.*`, `render.php`, `view.*`, `style.*`, and `editor.*`.
- PHP block registration code and `build/**` artifacts.
- `package.json`, `webpack.config.*`, `.wp-env.json`, and generated `.asset.php` files.
- REST endpoints or post meta used by the block.

### Questions To Ask

- Does the block need to be dynamic, static, or hybrid?
- Is `block.json` the canonical metadata source?
- Are editor assets separated from frontend assets?
- Are dynamic attributes sanitized and output escaped in PHP render code?
- Does the block load frontend JavaScript only where needed?

### Must-Pass Checks

- `block.json` has valid `name`, `apiVersion`, `title`, `category`, text domain, attributes, assets, and render metadata when dynamic.
- Block registration uses `register_block_type()` with the metadata path on `init`.
- Dynamic render code treats attributes and post data as untrusted.
- JavaScript uses WordPress packages instead of bundling incompatible React copies.
- Build output and `.asset.php` files are present or generated by documented scripts.

### Common Fixes

- Move hardcoded PHP/JS registration details into `block.json`.
- Add `render.php` or `render_callback` for server-rendered dynamic output.
- Replace hardcoded asset URLs with metadata registration and generated asset dependencies.
- Add `__()`, `sprintf()`, and translator comments for editor strings.
- Split `editorScript`, `viewScript`, `viewScriptModule`, `style`, and `editorStyle` by actual runtime need.

### Example Final Response Format For The Agent

```text
Block Review
- [P1] render.php outputs the heading attribute without escaping.
- [P2] view.js is loaded on every frontend page even though the block is not present.
- [P3] block.json is missing a textdomain for translatable editor strings.

Suggested Patch
Escape render output, move frontend behavior to block metadata, and rebuild assets with @wordpress/scripts.
```

## Workflow: REST Endpoint Review

### When To Use

Use when creating or reviewing `register_rest_route()` usage, REST controllers, API permissions, editor integrations, public endpoints, or external integrations.

### Files To Inspect

- REST controller classes and route registration callbacks.
- Code hooked to `rest_api_init`.
- Route callbacks, permission callbacks, schema/args arrays, and response factories.
- Tests for authorized, unauthorized, invalid, and successful requests.

### Questions To Ask

- Is the endpoint public, authenticated, or role/capability restricted?
- Are route namespace and version stable?
- Are parameters declared with schema, validation, and sanitization?
- Does the response leak private data or internal errors?
- Are errors returned as `WP_Error` with appropriate status codes?

### Must-Pass Checks

- Every route has a `permission_callback`.
- Callback and permission logic are separate enough to audit.
- Mutating methods use capability checks and nonce/application-password/auth context as appropriate.
- Request data is accessed through `WP_REST_Request`, not raw superglobals.
- Responses use `rest_ensure_response()`, `WP_REST_Response`, or `WP_Error`.

### Common Fixes

- Add a controller class with `register_routes()`.
- Add capability checks tied to the object or operation.
- Add `args` schemas with `type`, `required`, `sanitize_callback`, and `validate_callback`.
- Map exceptions/internal failures to safe `WP_Error` messages.
- Add tests for `401/403`, invalid args, and success paths.

### Example Final Response Format For The Agent

```text
REST Findings
- [P1] DELETE /example/v1/item/(?P<id>\\d+) allows any logged-in user to delete items.
- [P2] The `id` parameter is read from $_GET instead of WP_REST_Request.

Recommendation
Gate deletion with `current_user_can( 'delete_post', $id )`, declare the route arg schema, and add REST tests for unauthorized users.
```

## Workflow: Admin Settings Review

### When To Use

Use for Settings API pages, admin menus, options forms, tools pages, admin notices, onboarding screens, and admin asset loading.

### Files To Inspect

- Admin menu registration, settings registration, render callbacks, and form handlers.
- `register_setting()`, `add_settings_section()`, `add_settings_field()`, `settings_fields()`, and `do_settings_sections()`.
- Admin templates, notices, enqueue logic, and option defaults.
- Capability and nonce checks around custom handlers.

### Questions To Ask

- Which capability should access, view, edit, or delete this setting?
- Does WordPress Settings API handle the nonce and option update flow, or is there a custom handler?
- Are settings validated/sanitized before storage?
- Are admin assets loaded only on the target screen?
- Are labels, descriptions, notices, and errors accessible and translatable?

### Must-Pass Checks

- Admin menu capability matches the settings capability.
- `register_setting()` has a `sanitize_callback`.
- Custom POST actions check capability and nonce.
- Output is escaped in forms, notices, and attribute values.
- Settings have defaults and do not emit PHP notices when absent.

### Common Fixes

- Add a dedicated settings class with `register()`, `register_settings()`, and `render_page()`.
- Use `settings_fields()` and `options.php` when possible.
- Add `sanitize_text_field()`, `absint()`, `sanitize_key()`, `esc_url_raw()`, or custom validation by field context.
- Gate `admin_enqueue_scripts` by `$hook_suffix` or screen ID.
- Add accessible labels and `settings_errors()` output.

### Example Final Response Format For The Agent

```text
Admin Settings Findings
- [P1] The custom save action updates options without `current_user_can( 'manage_options' )`.
- [P2] `api_url` is stored without URL validation.
- [P2] Admin CSS is enqueued across all dashboard screens.

Fix Summary
Move the option into Settings API registration, add a sanitize callback, and scope assets to the plugin settings screen.
```

## Workflow: WordPress.org Release Readiness

### When To Use

Use before tagging a release, submitting to WordPress.org, building a plugin zip, updating assets, or changing plugin metadata.

### Files To Inspect

- Main plugin header, `readme.txt`, `LICENSE`, third-party dependency licenses, and screenshots/assets.
- `composer.json`, `package.json`, lockfiles, build output, `.distignore`, `.gitattributes`, and release scripts.
- Plugin Check output, CI output, PHPUnit/PHPCS/npm results, and WordPress.org SVN instructions.

### Questions To Ask

- Do plugin header version, `readme.txt` stable tag, changelog, and built zip version agree?
- Are all bundled dependencies license-compatible and documented?
- Are development-only files excluded from the release zip?
- Are build artifacts present for users who install from a zip?
- Have current WordPress.org and Plugin Check docs been verified for release-sensitive details?

### Must-Pass Checks

- `readme.txt` has required sections, tested up to, stable tag, license, FAQ/changelog where applicable, and accurate descriptions.
- Plugin headers include required and recommended fields.
- Plugin Check has no unresolved release-blocking errors.
- Built assets, translations, and autoload files needed at runtime are included.
- Secrets, local config, test fixtures, and development caches are excluded.

### Common Fixes

- Align version numbers across header, constants, package files, and readme stable tag.
- Add or correct `License`, `License URI`, `Requires at least`, `Requires PHP`, and `Text Domain`.
- Build assets before packaging and include generated files intentionally.
- Add `.distignore` or release script exclusions.
- Re-run Plugin Check after fixes and document non-blocking warnings.

### Example Final Response Format For The Agent

```text
Release Readiness
- [P0] Stable tag is 1.2.0 but plugin header version is 1.1.9.
- [P1] Plugin Check reports an escaping error in includes/render.php.
- [P2] `build/` is missing from the release zip although block.json references it.

Release Status
Not ready. Fix version alignment, escaping, and build artifacts, then rerun Plugin Check.
```

## Workflow: Performance Review

### When To Use

Use when:

- a plugin is slow;
- admin/editor screens feel slow;
- REST endpoints are slow or high-volume;
- frontend loads too many assets;
- dynamic blocks are expensive;
- a plugin is preparing for public release;
- the plugin affects high-traffic pages.

### Files To Inspect

- Main plugin bootstrap.
- Hook registration classes and service providers.
- Asset enqueue files.
- REST controllers and AJAX handlers.
- Admin screens, list tables, dashboard widgets, and settings pages.
- Block `render.php` files and `render_callback` code.
- `package.json`, build output, and generated `.asset.php` files.
- Custom table schema and migrations.
- Cron/background job code.
- Options, transients, object cache, and external HTTP usage.

### Questions To Ask

- What runs on every request?
- What runs only in admin?
- What runs only in the editor?
- What runs only on target screens?
- What queries are unbounded?
- What data is cached?
- How is cache invalidated?
- What assets are loaded globally?
- What REST endpoints can be paginated?
- What needs profiling before changing?

### Must-Pass Checks

- No `flush_rewrite_rules()` on normal requests.
- No remote HTTP call during frontend render without timeout, cache, and fallback.
- No unbounded `WP_Query`, `get_posts()`, REST collection, admin table, or cron batch on hot paths.
- No global frontend/admin/editor assets when a narrower screen, route, shortcode, or block scope exists.
- Dynamic block render callbacks validate attributes, escape output, bound queries, and cache expensive safe fragments.
- REST collection endpoints validate args, paginate, limit response shape, and preserve `permission_callback`.
- Cron schedules are registered on activation or versioned setup, guarded with `wp_next_scheduled()`, batched, and idempotent.
- Large rarely used data is not stored in autoloaded options.
- Caches have TTLs, safe keys, context separation, and invalidation hooks.
- Custom tables used for high-volume data have appropriate keys/indexes.

### Common Fixes

- Gate hooks by request type, screen ID, route, capability, post type, shortcode, or block presence.
- Move setup, rewrite flushing, and cron scheduling to activation/versioned migrations.
- Add pagination and upper bounds to queries and REST/admin collections.
- Use `no_found_rows => true` when totals are not needed.
- Use `fields => 'ids'` when only IDs are needed.
- Cache safe expensive results with explicit TTL and invalidation on `save_post`, option updates, term changes, or plugin-specific events.
- Split admin, editor, frontend, and block view assets.
- Use `block.json` asset fields and generated `.asset.php` files.
- Add locks and batching to cron/background jobs.
- Add measurement notes instead of guessing at production impact.

### Example Final Response Format For The Agent

```text
Executive Summary
The plugin has high performance risk on frontend and REST hot paths. Most impact comes from unbounded queries, global asset loading, and an uncached dynamic block render.

Performance Risk Score
High

Hot Paths Inspected
- Frontend `wp_enqueue_scripts`
- REST `/example/v1/items`
- `blocks/featured/render.php`
- Admin report screen

Findings
- [P1] src/Rest/Items_Controller.php:74 returns an unpaginated collection using `posts_per_page => -1`.
  Fix: add `page`/`per_page`, cap `per_page`, use `fields => ids`, and return a small response shape.
- [P2] includes/assets.php:19 enqueues frontend JS globally.
  Fix: enqueue only when the shortcode/block/route is present.
- [P2] blocks/featured/render.php:31 performs a fresh query on every render without cache.
  Fix: bound the query and add fragment cache with invalidation on content changes.

Measurement Plan
- Capture baseline request time, query count, memory, asset transfer size, and cache hit rate.
- Use Query Monitor or server traces on production-sized data.

Safe Rollout Plan
- Add output parity tests.
- Ship cache invalidation with the cache.
- Monitor slow requests and errors after deployment.

What Requires Profiling
- Exact cost of meta queries on production data.
- Object cache hit rate under traffic.

What Not To Optimize Yet
- Low-traffic admin-only UI until profiling shows measurable impact.
```

## Workflow: Accessibility/i18n Review

### When To Use

Use for admin UI, frontend output, block editor UI, forms, notices, settings pages, public strings, and release-readiness reviews.

### Files To Inspect

- PHP templates, admin views, block `edit.js`, `save.js`, `render.php`, shortcode output, and notices.
- JavaScript using `@wordpress/components`, custom controls, modals, keyboard handlers, and dynamic announcements.
- Translation setup, text domain loading, `languages/`, generated POT files, and `block.json`.

### Questions To Ask

- Are all user-facing strings translatable with the correct text domain?
- Are dynamic strings using placeholders and translator comments where needed?
- Do form controls have visible labels or accessible names?
- Can keyboard users reach and operate every control?
- Is ARIA used only when native HTML cannot express the interaction?

### Must-Pass Checks

- PHP strings use `__()`, `esc_html__()`, `esc_attr__()`, `_x()`, `_n()`, or related functions by context.
- JavaScript strings use `@wordpress/i18n`.
- Forms associate labels with controls and render validation errors accessibly.
- Focus is managed for modals, notices, async updates, and inserted UI.
- Color is not the only way to convey meaning, and contrast is checked for custom UI.

### Common Fixes

- Add text domains to translation calls and `block.json`.
- Add translator comments before strings with placeholders or ambiguous context.
- Replace clickable `<div>`/`span` controls with buttons or links.
- Add `aria-describedby` for help/error text and use `wp.a11y.speak()` for async admin feedback where appropriate.
- Escape translated output with the correct escaping translation function.

### Example Final Response Format For The Agent

```text
Accessibility/i18n Findings
- [P1] The settings form has inputs without labels, so screen-reader users cannot identify fields.
- [P2] Editor strings in src/edit.js are hardcoded and not passed through @wordpress/i18n.
- [P2] Error text is injected visually but not announced after async save failures.

Fix Summary
Add labels/help text associations, wrap editor strings in `__()`, and announce async errors through the WordPress a11y helper.
```
