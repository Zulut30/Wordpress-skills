# Interactivity API

Last reviewed: 2026-04-26

## Official Sources

- Interactivity API reference: https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/
- Directives and Store: https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/directives-and-store/
- `@wordpress/interactivity`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-interactivity/
- `@wordpress/scripts`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/
- Block metadata reference: https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/

## Verify Current Docs First

The Interactivity API evolves quickly. Always verify the current official docs before adding advanced patterns, async actions, router usage, script module build flags, server processing helpers, or claims about minimum WordPress/Gutenberg versions. Do not invent directives or store APIs.

## What It Is

The WordPress Interactivity API is the WordPress-native way to add frontend interactivity to blocks using declarative HTML directives and a JavaScript store. It is designed for server-rendered block markup that needs small to medium client-side behavior without shipping a custom frontend framework for every block.

Use it when:

- A block needs frontend state, actions, callbacks, or DOM updates.
- Multiple interactive blocks need to share state or behavior.
- Markup should be rendered by WordPress/PHP but enhanced on the frontend.
- The interaction is tied to block content, such as counters, toggles, filters, mini carts, instant search, or navigation-like UI.

Avoid it when:

- Plain CSS or minimal vanilla JS is enough.
- The behavior exists only in the editor, where React and block editor packages are already the right layer.
- The feature is a full application that needs routing, complex client data, authentication flows, or headless architecture outside normal block rendering.

## Requirements

Baseline requirements to check before implementation:

- WordPress 6.5+ for Core support. For older WordPress targets, verify whether the required Gutenberg plugin version is acceptable for the project.
- `@wordpress/interactivity` for `store`, `getContext`, and related APIs. In WordPress 6.5+ it is bundled in Core; project builds still import it from npm source.
- `supports.interactivity = true` in `block.json`.
- `viewScriptModule` in `block.json` for frontend Interactivity API code.
- `wp-scripts build --experimental-modules` and `wp-scripts start --experimental-modules` when current tooling requires that flag for `viewScriptModule`.

Example `package.json` scripts:

```json
{
  "scripts": {
    "build": "wp-scripts build --experimental-modules",
    "start": "wp-scripts start --experimental-modules"
  }
}
```

Verify the latest `@wordpress/scripts` docs before copying these flags into a real project.

## Core Concepts

- Directives: `data-wp-*` attributes in rendered markup. They bind DOM behavior to store entries, state, context, classes, styles, text, events, lifecycle callbacks, and loops.
- `data-wp-interactive`: Declares an interactive region and namespace, such as `data-wp-interactive="acmeCounter"`.
- Store: A namespaced object created with `store( namespace, parts )` in `view.js`.
- State: Shared reactive data in the store. Use it for cross-block or global values that multiple interactive regions may read.
- Context: Local data attached to a rendered DOM subtree, often printed server-side with `wp_interactivity_data_wp_context()`.
- Actions: Functions triggered by directives such as `data-wp-on--click="actions.increment"`.
- Callbacks: Lifecycle or side-effect functions referenced by directives such as `data-wp-init`, `data-wp-watch`, or `data-wp-run`.
- Server helpers: WordPress provides helpers such as `wp_interactivity_state()` and `wp_interactivity_data_wp_context()` for server-side initialization and safe directive markup.

Agent rule: keep local per-block-instance values in context; use store state only when values are genuinely shared.

## Decision Tree

Choose plain JS when:

- The behavior is isolated, small, and does not need reactive state.
- No server-side directive processing, shared store, or block coordination is needed.
- Existing theme/plugin JS already handles the behavior safely and efficiently.

Choose React in editor only when:

- The behavior is for `edit.js`, Inspector Controls, SlotFills, or editor-only UI.
- Frontend markup does not need the same interactive runtime.

Choose Interactivity API when:

- Frontend block markup needs declarative behavior.
- PHP-rendered output should be interactive without becoming a SPA.
- Several blocks need shared state, shared actions, or coordinated frontend behavior.
- Progressive enhancement matters.

Choose a full SPA/headless approach when:

- The feature owns whole-page routing and data loading.
- The frontend is decoupled from block rendering.
- You need app-level state, authenticated client workflows, or a non-WordPress rendering layer.

## Security And Performance

- Escape server-rendered data before it enters markup. Prefer WordPress helpers for directive attributes instead of hand-built JSON attributes.
- Keep state and context minimal. Do not serialize whole posts, user objects, tokens, secrets, capability maps, or private metadata into markup.
- Treat all server-provided values as public once they are printed in the page.
- Validate and authorize any REST, AJAX, or navigation endpoint used by actions.
- Avoid global state when context is enough; global state increases coupling between blocks.
- Keep `view.js` small and block-scoped. Do not load a large frontend bundle on pages that do not contain the block.
- Preserve useful server-rendered fallback markup where practical.
- Avoid long synchronous actions. For advanced async actions or synchronous event access patterns, verify current docs first.

## Example: Interactive Counter Block

This is a minimal dynamic block pattern. It renders useful HTML on the server and enhances it with a frontend store.

### block.json

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "acme/counter",
  "title": "Counter",
  "category": "widgets",
  "icon": "plus-alt2",
  "description": "Displays an interactive counter.",
  "textdomain": "acme-counter",
  "supports": {
    "html": false,
    "interactivity": true
  },
  "attributes": {
    "initialCount": {
      "type": "integer",
      "default": 0
    }
  },
  "editorScript": "file:./index.js",
  "viewScriptModule": "file:./view.js",
  "style": "file:./style-index.css",
  "render": "file:./render.php"
}
```

### PHP Registration

```php
add_action(
	'init',
	static function (): void {
		register_block_type( __DIR__ . '/build/counter' );
	}
);
```

### render.php

```php
<?php
/**
 * Server-rendered markup for acme/counter.
 *
 * @var array $attributes Block attributes.
 */

defined( 'ABSPATH' ) || exit;

$initial_count = isset( $attributes['initialCount'] ) ? (int) $attributes['initialCount'] : 0;

if ( 0 > $initial_count ) {
	$initial_count = 0;
}
?>
<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-interactive="acmeCounter"
	<?php echo wp_interactivity_data_wp_context( array( 'count' => $initial_count ) ); ?>
>
	<p>
		<?php echo esc_html__( 'Count:', 'acme-counter' ); ?>
		<span data-wp-text="context.count"><?php echo esc_html( (string) $initial_count ); ?></span>
	</p>
	<button type="button" data-wp-on--click="actions.increment">
		<?php echo esc_html__( 'Increase', 'acme-counter' ); ?>
	</button>
	<button type="button" data-wp-on--click="actions.reset">
		<?php echo esc_html__( 'Reset', 'acme-counter' ); ?>
	</button>
</div>
```

Notes for the agent:

- Use `wp_interactivity_data_wp_context()` instead of manually building `data-wp-context`.
- Escape visible fallback text even though the Interactivity API will update it after hydration.
- Do not place private values in context.

### view.js

```js
import { store, getContext } from '@wordpress/interactivity';

store( 'acmeCounter', {
	actions: {
		increment() {
			const context = getContext();
			context.count += 1;
		},
		reset() {
			const context = getContext();
			context.count = 0;
		},
	},
} );
```

### package.json

```json
{
  "scripts": {
    "build": "wp-scripts build --experimental-modules",
    "start": "wp-scripts start --experimental-modules",
    "lint:js": "wp-scripts lint-js"
  }
}
```

Install the current compatible versions of `@wordpress/interactivity` and `@wordpress/scripts` for the target WordPress release before building.

## Review Checklist

- WordPress minimum version supports the Interactivity API features used.
- `block.json` has `supports.interactivity: true` and `viewScriptModule`.
- Build scripts support module compilation for the current tooling.
- Interactive region has `data-wp-interactive` with the same namespace as `store()`.
- Server-rendered context/state is minimal, public, and escaped or emitted through official helpers.
- Actions do not bypass REST permissions, nonces, or capability checks.
- Frontend JS is scoped to pages where the block appears.
- Advanced directives, async actions, router usage, and server processing APIs were verified against current docs.
