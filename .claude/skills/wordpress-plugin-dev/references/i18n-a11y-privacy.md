# Internationalization, Accessibility, Privacy

Last reviewed: 2026-04-26

## Official Sources

- Internationalization: https://developer.wordpress.org/apis/internationalization/
- Plugin internationalization: https://developer.wordpress.org/plugins/internationalization/
- Internationalization functions: https://developer.wordpress.org/apis/internationalization/internationalization-functions/
- Accessibility Coding Standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/accessibility/
- Plugin Privacy: https://developer.wordpress.org/plugins/privacy/
- Personal Data Exporter: https://developer.wordpress.org/plugins/privacy/adding-the-personal-data-exporter-to-your-plugin/
- Personal Data Eraser: https://developer.wordpress.org/plugins/privacy/adding-the-personal-data-eraser-to-your-plugin/
- Privacy policy suggestions: https://developer.wordpress.org/plugins/privacy/suggesting-text-for-the-site-privacy-policy/
- `@wordpress/i18n`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/

## Verify Current Docs First

Verify current i18n extraction tooling, JavaScript translation loading, accessibility standards, and privacy hook behavior before changing release automation or public plugin behavior.

## Text Domain Strategy

- Use one plugin text domain, normally the plugin slug: `example-tools`.
- Match `Text Domain` in the plugin header, `block.json` `textdomain`, PHP strings, JS strings, and readme metadata.
- Use `Domain Path: /languages` only when bundled translation files are expected there.
- Do not use another plugin's text domain.
- Do not concatenate translatable sentence fragments. Translate complete phrases or use placeholders.
- Keep placeholders stable and explain ambiguous placeholders with translator comments.

Bad:

```php
echo __( 'Delete ', 'example-tools' ) . $name;
```

Good:

```php
printf(
	esc_html__( 'Delete %s', 'example-tools' ),
	esc_html( $name )
);
```

## PHP Translation Functions

- `__( 'Text', 'domain' )`: return translated text for later escaping/output.
- `_e( 'Text', 'domain' )`: echo translated text; avoid when output needs escaping, prefer `esc_html_e()` or explicit escaping.
- `esc_html__( 'Text', 'domain' )`: translate and escape for HTML text.
- `esc_attr__( 'Text', 'domain' )`: translate and escape for attributes.
- `_x( 'Post', 'noun', 'domain' )`: add context for ambiguous strings.
- `_n( '%s item', '%s items', $count, 'domain' )`: plural forms.

Plural example:

```php
printf(
	esc_html(
		_n(
			'%s item imported.',
			'%s items imported.',
			$count,
			'example-tools'
		)
	),
	number_format_i18n( $count )
);
```

## Translator Comments

Add a `translators:` comment immediately before a string when placeholders, context, grammar, or ordering may be unclear.

```php
/* translators: %s: Plugin setting label. */
$message = sprintf( __( 'Saved setting: %s', 'example-tools' ), $label );
```

Use comments for:

- Placeholder meanings.
- URLs or HTML fragments in strings.
- Abbreviations or product names.
- Strings where grammar depends on runtime values.

## JavaScript Translations

- Use `@wordpress/i18n` in editor/block/admin JS.
- Import only what is needed: `__`, `_x`, `_n`, `sprintf`.
- Ensure the script build/enqueue flow supports translation extraction and loading.
- Use `wp_set_script_translations()` for custom enqueued scripts when needed.

```js
import { __, sprintf } from '@wordpress/i18n';

const label = sprintf(
	/* translators: %s: block title. */
	__( 'Edit %s block', 'example-tools' ),
	title
);
```

For `block.json`, keep `textdomain` set and use metadata fields normally; WordPress tooling can discover translatable block metadata when configured correctly.

## Accessibility

Operational rules:

- Labels: every input needs a visible `<label>` or a clear accessible name. Use `for`/`id` pairs where practical.
- Keyboard navigation: every interactive control must be reachable and operable by keyboard.
- Focus management: after opening modals/panels, move focus intentionally; after closing, return focus to the triggering control when possible.
- ARIA: use native HTML first. Add ARIA only when native semantics are insufficient, and keep states such as `aria-expanded` accurate.
- Admin notices: use WordPress notice classes, concise copy, and proper dismissible behavior only when persistence is needed.
- Color contrast: do not rely on color alone; preserve visible focus states and sufficient contrast.
- Dynamic updates: announce important async results with visible notices or appropriate live regions.
- Tables/lists: use table headers, scopes, captions, or list semantics for structured data.

Bad:

```html
<div onclick="save()">Save</div>
```

Good:

```html
<button type="submit" class="button button-primary">
	<?php echo esc_html__( 'Save', 'example-tools' ); ?>
</button>
```

## Privacy

A plugin likely handles personal data if it:

- Stores user profile fields, emails, IP addresses, location data, form submissions, orders, logs, analytics identifiers, or support messages.
- Sends data to an external API or SaaS.
- Sets cookies or tracking identifiers.
- Stores private post/meta data that can identify a person.
- Logs admin/user actions with user IDs or network addresses.

Data minimization:

- Collect only data needed for the feature.
- Store the least sensitive form of the data.
- Define retention and deletion behavior.
- Avoid logging secrets, tokens, full payloads, or unnecessary PII.
- Make external services visible in settings/docs.

Export/erase overview:

- Add personal data exporter callbacks when the plugin stores personal data that users may request.
- Add eraser callbacks when plugin-owned personal data can be deleted or anonymized.
- Keep callbacks paginated and idempotent.
- Do not erase data the plugin does not own or data required for legal/accounting obligations without an explicit policy.

Privacy policy suggestions:

- Provide concise text describing what data is collected, why, where it is stored, how long it is retained, and which third parties receive it.
- Update suggestions when adding new external services, cookies, tracking, logs, or personal data fields.

## Code Review Checklist

- Text domain is consistent in plugin header, PHP, JS, `block.json`, and readme.
- New public strings use translation functions.
- Output strings use escaped translation helpers or are escaped at output.
- Placeholders have translator comments.
- Plurals use `_n()` and numbers use `number_format_i18n()` where displayed.
- JS UI strings use `@wordpress/i18n` and translation loading is configured when needed.
- Form controls have labels and accessible names.
- Interactive UI works with keyboard and has visible focus.
- ARIA is necessary, valid, and synchronized with UI state.
- Admin notices are semantic, concise, and dismissible only when appropriate.
- Color is not the only signal, and contrast/focus states are preserved.
- Personal data storage, external transfers, cookies, and logs are identified.
- Export/erase hooks are planned or implemented when personal data is stored.
- Privacy policy suggestions and data minimization are considered before release.
