# Coding Standards

Last reviewed: 2026-04-26

## Official Sources

- WordPress Coding Standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/
- PHP Coding Standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/
- JavaScript Coding Standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/
- CSS Coding Standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/
- HTML Coding Standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/html/
- Inline Documentation Standards: https://developer.wordpress.org/coding-standards/inline-documentation-standards/
- WordPress Coding Standards for PHPCS: https://github.com/WordPress/WordPress-Coding-Standards
- PHPCompatibilityWP: https://github.com/PHPCompatibility/PHPCompatibilityWP
- `@wordpress/scripts`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/

## Verify Current Docs First

Verify current WPCS, PHPCompatibilityWP, PHPCS, PHPStan/Psalm, and `@wordpress/scripts` versions before changing tooling or CI. Respect the project's existing standards config when present.

## Agent Writing Rules

- Match the existing plugin style unless it is unsafe or clearly violates WordPress release requirements.
- Apply WordPress standards to first-party plugin code. Do not rewrite third-party libraries, vendored code, generated build files, or minified assets just to satisfy WPCS.
- Keep security rules higher priority than formatting: capability checks, nonces, sanitization, validation, escaping, prepared SQL, and safe filesystem handling.
- Avoid large unrelated formatting diffs. If a formatter touches too much, scope the run or edit manually.

## PHP Style

- Use namespaces and Composer autoload for medium/large plugins; prefix global functions and constants in small procedural plugins.
- Prefer strict, readable control flow with early returns for failed permissions, invalid input, or missing dependencies.
- Use WordPress APIs before raw PHP or SQL alternatives: Options API, Metadata API, HTTP API, Filesystem API, Scripts API, REST API, Cron API.
- Escape output at the output boundary, not at storage time.
- Keep hook callbacks small. Delegate behavior to named functions or class methods.
- Do not emit output during plugin load except intentional CLI/admin handling.
- Keep public hooks documented and prefixed.

Bad:

```php
function save() {
	update_option( 'label', $_POST['label'] );
}
```

Good:

```php
function example_tools_save_label(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$label = sanitize_text_field( wp_unslash( $_POST['label'] ?? '' ) );
	update_option( 'example_tools_label', $label );
}
```

## JavaScript Style

- Prefer `@wordpress/scripts` for linting, formatting, testing, and builds in block/editor projects.
- Import WordPress packages by public package name, such as `@wordpress/i18n`, `@wordpress/element`, `@wordpress/components`, and `@wordpress/data`.
- Keep editor scripts, frontend scripts, and Interactivity API script modules separate.
- Do not trust localized/server-provided data; PHP must enforce security, and JS should still validate UI inputs.
- Use `@wordpress/i18n` for user-visible strings.
- Avoid direct DOM mutation in block editor code when React/state APIs are appropriate.

## CSS Style

- Scope selectors to plugin wrappers, block classes, or admin page classes.
- Do not style broad WordPress admin selectors globally.
- Prefer WordPress admin variables/classes where appropriate.
- Keep contrast and focus states visible.
- Avoid `!important` unless overriding third-party or core specificity is unavoidable and documented.

## HTML Style

- Use semantic elements and valid nesting.
- Add labels for form fields and associate labels with controls.
- Escape all dynamic attributes and text.
- Use buttons for actions and links for navigation.
- Avoid custom ARIA when native HTML provides the needed semantics.

## Naming Rules

- Plugin slug: lowercase words separated by hyphens, e.g. `example-tools`.
- PHP namespace: vendor/plugin style, e.g. `ExampleOrg\ExampleTools`.
- Global functions: prefix with plugin slug using underscores, e.g. `example_tools_register_blocks()`.
- Classes: `Upper_Camel_Case` or project-preferred PSR-style; keep namespaces clear.
- Constants: uppercase plugin prefix, e.g. `EXAMPLE_TOOLS_VERSION`.
- Hooks: prefix with plugin slug, e.g. `example_tools_before_render`.
- Option/meta/transient keys: prefix with plugin slug, e.g. `example_tools_label`.
- Script/style handles: prefix with slug, e.g. `example-tools-admin`.
- Files: follow project convention; common WordPress class files use `class-example-controller.php`, PSR-4 projects use `Example_Controller.php` or `ExampleController.php`.

Bad:

```php
do_action( 'before_render' );
```

Good:

```php
do_action( 'example_tools_before_render', $context );
```

## PHPDoc And JSDoc Expectations

- Document public classes, public methods, public functions, custom hooks, filters, REST callbacks, complex arrays, and non-obvious return values.
- Include `@param`, `@return`, `@throws` only when useful and accurate.
- Add `@since` only if the project tracks public API versions.
- Use translator comments before strings with placeholders.
- In JS, use JSDoc for exported functions, complex object shapes, custom hooks, selectors/actions, and callback contracts.
- Do not add noisy comments that merely restate the function name.

Custom hook example:

```php
/**
 * Fires before the example tools card is rendered.
 *
 * @param array $context Prepared render context.
 */
do_action( 'example_tools_before_card', $context );
```

## Composer Tooling

Recommended `composer.json` scripts:

```json
{
  "scripts": {
    "phpcs": "phpcs",
    "phpcbf": "phpcbf",
    "analyse": "phpstan analyse"
  },
  "require-dev": {
    "wp-coding-standards/wpcs": "^3.0",
    "phpcompatibility/phpcompatibility-wp": "^2.1",
    "phpstan/phpstan": "^1.12"
  }
}
```

Notes:

- `phpstan` or `psalm` is optional. Add one only if the project can maintain baselines and type coverage.
- If using Psalm instead of PHPStan, use a script such as `"analyse": "psalm"`.
- Keep PHPCS rules in `.phpcs.xml.dist` or `phpcs.xml.dist` and exclude `vendor`, `node_modules`, `build`, minified files, and generated artifacts.

## NPM Tooling

Recommended `package.json` scripts:

```json
{
  "scripts": {
    "lint:js": "wp-scripts lint-js",
    "lint:style": "wp-scripts lint-style",
    "format": "wp-scripts format"
  },
  "devDependencies": {
    "@wordpress/scripts": "^30.0.0"
  }
}
```

Notes:

- Verify current `@wordpress/scripts` requirements before pinning versions or adding flags.
- Do not format vendored JS, generated builds, or minified assets unless the project explicitly owns them.
- If the project already uses a custom webpack/Vite/ESLint setup, preserve it unless the user asks to migrate.

## Code Review Checklist

- First-party PHP follows WPCS naming, spacing, escaping, and documentation expectations.
- Globals, hooks, options, meta keys, handles, and transients are prefixed.
- Hook callbacks are named and testable when removal/testing matters.
- Public hooks have concise docs.
- JS imports public WordPress packages and uses i18n for UI strings.
- CSS is scoped and does not globally disturb WP Admin or frontend themes.
- HTML is semantic, labeled, escaped, and keyboard-friendly.
- Composer/npm scripts exist or the absence is appropriate for a small plugin.
- Third-party/generated code is excluded from style rewrites.
