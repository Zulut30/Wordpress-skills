# Dynamic Block

```php
add_action(
	'init',
	static function (): void {
		register_block_type( __DIR__ . '/build/demo-dynamic' );
	}
);
```

```php
// build/demo-dynamic/render.php
$message = isset( $attributes['message'] ) ? sanitize_text_field( $attributes['message'] ) : '';
?>
<p <?php echo get_block_wrapper_attributes(); ?>>
	<?php echo esc_html( $message ); ?>
</p>
```

Use a dynamic block when output depends on current server state or must evolve without resaving posts.
