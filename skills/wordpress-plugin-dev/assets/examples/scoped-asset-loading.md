# Scoped Asset Loading

## Before

```php
add_action(
	'wp_enqueue_scripts',
	static function (): void {
		wp_enqueue_script( 'acme-app', plugins_url( 'app.js', __FILE__ ), array(), '1.0.0', true );
	}
);
```

Problem: every frontend page pays for the asset.

## After

```php
add_action(
	'wp_enqueue_scripts',
	static function (): void {
		$post = is_singular() ? get_post() : null;

		if ( ! $post || ! has_shortcode( (string) $post->post_content, 'acme-widget' ) ) {
			return;
		}

		wp_enqueue_script(
			'acme-widget',
			plugins_url( 'build/widget.js', __FILE__ ),
			array(),
			'1.0.0',
			array( 'strategy' => 'defer' )
		);
	}
);
```

For blocks, prefer `block.json` asset fields so WordPress can enqueue block assets only when needed.
