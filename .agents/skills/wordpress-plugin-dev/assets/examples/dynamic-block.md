# Minimal Dynamic Block Example

Use this pattern when frontend output depends on current server state or should update without resaving existing posts. Treat it as a compact starting point, not a full plugin.

## File Tree

```text
acme-events/
  acme-events.php
  blocks/
    featured-event/
      block.json
      index.js
      src/
        edit.js
        save.js
      render.php
      style.scss
      editor.scss
  build/
    featured-event/
      block.json
      index.js
      index.asset.php
      render.php
      style-index.css
      index.css
```

## PHP Registration

```php
<?php
/**
 * Plugin Name: Acme Events
 * Description: Example dynamic block plugin.
 * Version: 0.1.0
 * Requires at least: 6.5
 * Requires PHP: 8.1
 * Text Domain: acme-events
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'init',
	static function (): void {
		register_block_type( __DIR__ . '/build/featured-event' );
	}
);
```

## block.json

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "acme-events/featured-event",
  "title": "Featured Event",
  "category": "widgets",
  "icon": "calendar-alt",
  "description": "Displays a selected event title.",
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

## edit.js

```js
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const eventId = Number.parseInt( attributes.eventId, 10 ) || 0;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Event settings', 'acme-events' ) }>
					<TextControl
						label={ __( 'Event ID', 'acme-events' ) }
						type="number"
						value={ eventId || '' }
						onChange={ ( value ) =>
							setAttributes( {
								eventId: Number.parseInt( value, 10 ) || 0,
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ eventId
					? __( 'Featured event selected.', 'acme-events' )
					: __( 'Select an event ID.', 'acme-events' ) }
			</div>
		</>
	);
}
```

## save.js

```js
export default function save() {
	return null;
}
```

## index.js

```js
import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './src/edit';
import save from './src/save';

registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );
```

## render.php

```php
<?php
/**
 * Dynamic render template for acme-events/featured-event.
 *
 * @var array $attributes Block attributes.
 */

defined( 'ABSPATH' ) || exit;

$event_id = isset( $attributes['eventId'] ) ? absint( $attributes['eventId'] ) : 0;

if ( ! $event_id ) {
	return;
}

$event = get_post( $event_id );

if ( ! $event || 'publish' !== $event->post_status ) {
	return;
}

$title = get_the_title( $event );

if ( '' === $title ) {
	return;
}
?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<strong><?php echo esc_html__( 'Featured event:', 'acme-events' ); ?></strong>
	<span><?php echo esc_html( $title ); ?></span>
</div>
```

## package.json Scripts

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

Verify the current `@wordpress/scripts` version before copying this into a real plugin.
