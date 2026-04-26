# Blocks And Gutenberg

Last reviewed: 2026-04-26

## Official Sources

- Block Editor Handbook: https://developer.wordpress.org/block-editor/
- Block metadata reference: https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/
- Block registration: https://developer.wordpress.org/block-editor/getting-started/fundamentals/registration-of-a-block/
- Dynamic blocks: https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/creating-dynamic-blocks/
- `@wordpress/blocks`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/
- `@wordpress/block-editor`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
- `@wordpress/components`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-components/
- `@wordpress/i18n`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
- `@wordpress/scripts`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/
- Interactivity API: https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/

## Verify Current Docs First

Verify current WordPress, Gutenberg, and `@wordpress/scripts` docs before giving exact claims about block metadata fields, `apiVersion`, script module behavior, Interactivity API directives, build flags, or minimum supported versions. Treat `viewScriptModule`, metadata collections, and script module APIs as version-sensitive.

## When A Plugin Should Include A Block

Add a block when the user needs editor-native content insertion, visual controls, reusable layout, block directory discoverability, or frontend output driven by structured attributes. Prefer a block over a shortcode for new editor-facing content.

Do not add a block when the feature is only an admin settings screen, a pure background integration, or a simple legacy rendering surface where a shortcode is already the correct compatibility contract. Keep blocks scoped: one clear editing task per block.

Use a dynamic block when output depends on current server state, permissions, queries, external data, or markup that must update across existing posts without resaving content. Use a static block when saved markup is stable, self-contained, and does not need server-time decisions.

## Recommended Block Tree

```text
plugin-slug/
  plugin-slug.php
  blocks/
    my-block/
      block.json
      index.js
      src/
        edit.js
        save.js
      render.php
      style.scss
      editor.scss
      view.js
  build/
    my-block/
      block.json
      index.js
      index.asset.php
      style-index.css
      index.css
      render.php
      view.js
      view.asset.php
```

Use `blocks/` or `src/` as the source location consistently. Use `build/` as generated output for releases. If distributing on WordPress.org, package the files WordPress needs at runtime; do not assume the end user will run npm.

## block.json

Use `block.json` as the source of truth and register blocks server-side from metadata. Keep names lowercase and unique.

Core fields to consider:

- `$schema`: Use `https://schemas.wp.org/trunk/block.json` for editor validation and autocomplete.
- `apiVersion`: Use the current stable API supported by the plugin's minimum WordPress version. As reviewed, API version 3 is current in the official reference.
- `name`: Use `namespace/slug`, usually `plugin-slug/block-name`.
- `title`: Human-readable inserter title. Keep concise and translatable.
- `category`: Use a core category such as `text`, `media`, `design`, `widgets`, `theme`, or `embed`, unless the plugin registers a custom category.
- `icon`: Prefer a Dashicons slug or a small JS-side icon object when needed.
- `description`: Short user-facing purpose text.
- `textdomain`: Match the plugin text domain.
- `attributes`: Declare structured data, types, defaults, and sources. Validate and sanitize server-side before rendering dynamic output.
- `supports`: Enable only the block supports the implementation actually handles, such as `align`, `spacing`, `color`, or `html`.
- `editorScript`: Editor-only script, usually `file:./index.js`.
- `script`: Script for both editor and frontend when both truly need it.
- `viewScript`: Frontend script enqueued when the block is present.
- `viewScriptModule`: Frontend script module; verify minimum WordPress support before using.
- `style`: Shared frontend/editor style.
- `editorStyle`: Editor-only style.
- `render`: Dynamic block render file, usually `file:./render.php`.

Minimal dynamic metadata:

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "acme-events/featured-event",
  "title": "Featured Event",
  "category": "widgets",
  "icon": "calendar-alt",
  "description": "Displays a selected event.",
  "textdomain": "acme-events",
  "attributes": {
    "eventId": {
      "type": "integer",
      "default": 0
    }
  },
  "supports": {
    "html": false
  },
  "editorScript": "file:./index.js",
  "style": "file:./style-index.css",
  "editorStyle": "file:./index.css",
  "render": "file:./render.php"
}
```

## PHP Registration

Register blocks on `init` using the metadata path. Prefer server-side registration even when JavaScript also calls `registerBlockType`, because server registration enables REST discovery, metadata processing, translations, and asset handling.

```php
add_action(
	'init',
	static function (): void {
		register_block_type( __DIR__ . '/build/featured-event' );
	}
);
```

For multiple blocks, loop over known build directories or use current official metadata collection APIs only after verifying the target WordPress version. Avoid scanning arbitrary directories on every request when the list can be static.

Dynamic rendering options:

- Use `"render": "file:./render.php"` in `block.json` for a metadata-based render file.
- Use `render_callback` in PHP when the render function must be injected or shared across blocks.
- In render code, cast and validate attributes, check capabilities if output reveals protected data, and escape late.

Render file rule: `render.php` receives block context from WordPress, but it is still plugin code. Do not trust `$attributes`, post meta, options, request data, or remote data.

## JS Registration

Use `registerBlockType` from `@wordpress/blocks`. When importing metadata, keep JS settings focused on editor behavior:

```js
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from '../block.json';

registerBlockType( metadata.name, {
	edit() {
		return (
			<p { ...useBlockProps() }>
				{ __( 'Edit block content.', 'acme-events' ) }
			</p>
		);
	},
	save() {
		return null;
	},
} );
```

For a static block, `save()` returns serialized markup. For a dynamic block, `save()` usually returns `null`, and PHP renders the frontend.

Use package imports from the WordPress environment:

- `@wordpress/components` for controls such as `PanelBody`, `TextControl`, `SelectControl`, `ToggleControl`, and `Button`.
- `@wordpress/block-editor` for block editing primitives such as `useBlockProps`, `InspectorControls`, `RichText`, `InnerBlocks`, and media-related editor controls.
- `@wordpress/i18n` for `__`, `_x`, `_n`, and related translation helpers.

Do not import React from arbitrary bundled copies unless the build and WordPress target explicitly support it. Prefer WordPress package APIs and JSX conventions expected by `@wordpress/scripts`.

## Build

Prefer `@wordpress/scripts` for block builds unless the plugin has a clear reason for custom webpack or Vite. Typical root scripts:

```json
{
  "scripts": {
    "start": "wp-scripts start",
    "build": "wp-scripts build",
    "lint:js": "wp-scripts lint-js",
    "lint:style": "wp-scripts lint-style",
    "format": "wp-scripts format"
  },
  "devDependencies": {
    "@wordpress/scripts": "^30.0.0"
  }
}
```

Verify the latest `@wordpress/scripts` version and flags before pinning. Generated `.asset.php` files contain dependency handles and version data for built entry points. Do not hand-maintain dependencies if the build creates the asset file.

Build discipline:

- Commit or package generated `build/` assets for distributed plugins.
- Keep source maps out of production zips unless intentionally shipped.
- Use block metadata asset fields instead of hardcoded enqueue URLs.
- Load frontend JS only via `viewScript`, `script`, `viewScriptModule`, or targeted enqueue logic when the block is present.
- If using Interactivity API, verify current directives, store APIs, script module support, and minimum WordPress version first.

## Patterns

### Dynamic Block

Use for latest content, account-specific output, remote data, protected data, or markup that must update globally. Store only stable attributes in post content and render in PHP.

Agent rules:

- Treat attributes as untrusted.
- Escape all rendered markup.
- Cache expensive queries with invalidation when needed.
- Keep permission-sensitive output behind capability or visibility checks.

### Static Block

Use when the post should store the final markup and the block does not require server state.

Agent rules:

- Keep `save()` deterministic.
- Use `RichText.Content` or block editor serialization helpers where appropriate.
- Avoid later changing saved markup in incompatible ways without deprecations.

### Block With REST-Powered Inspector Controls

Use when editor controls need searchable entities, settings, external records, or async validation.

Agent rules:

- Build a secure REST route with `permission_callback`.
- Validate route args and return `WP_Error` for failures.
- Use editor data fetching or `apiFetch` with loading, empty, and error states.
- Do not expose private data just because the route is editor-only.

### Block Using Post Meta

Use when block controls edit canonical post-level data rather than block-local attributes.

Agent rules:

- Register meta with `show_in_rest`, `single`, `type`, `sanitize_callback`, and `auth_callback` where appropriate.
- Match the meta type to editor control values.
- Check that the post type supports `custom-fields` or the chosen meta workflow.
- Avoid duplicating the same data in both attributes and post meta unless there is a deliberate migration plan.

## Common Mistakes

- Hardcoding asset URLs instead of using block metadata, generated asset files, or WordPress enqueue APIs.
- Missing or mismatched `textdomain`, causing untranslated block strings.
- Rendering unsafe `render.php` output without validation, capability checks, or escaping.
- Loading huge frontend JS globally when only block pages need it.
- Depending on React APIs or package versions that are not bundled or compatible with the target WordPress environment.
- Forgetting generated `.asset.php` files in release artifacts.
- Using `__return_true` REST permissions for editor-only data.
- Changing static block markup without a deprecation path.
- Using block attributes for secrets, tokens, or private data stored in post content.

## Agent Checklist Before Writing Block Code

- Identify whether the feature needs a block, shortcode, admin UI, sidebar plugin, pattern, or template part.
- Decide static vs dynamic based on server-time data and future markup compatibility.
- Set the plugin namespace, block slug, text domain, and minimum WordPress version.
- Create or update `block.json` first, then align PHP and JS registration with it.
- Use `@wordpress/scripts` unless the repository already has a justified build system.
- Plan security for REST routes, render callbacks, post meta, and remote data.
- Add i18n for public strings and accessible labels for controls.
- Keep frontend assets block-scoped and release-ready.
- Add or update tests and run build, lint, and plugin checks available in the project.
