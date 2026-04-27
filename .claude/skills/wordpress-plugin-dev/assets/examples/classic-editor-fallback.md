# Classic Editor Fallback Example

Use a shared service so the block editor sidebar and classic metabox save the same data.

Bad pattern:

```php
// Block sidebar saves one meta key; metabox saves another with no nonce.
update_post_meta( $post_id, '_example_block_value', $_POST['value'] );
```

Better pattern:

```php
final class Shared_Meta_Service {
	public function save_value( int $post_id, string $value ): void {
		update_post_meta( $post_id, '_example_value', sanitize_text_field( $value ) );
	}

	public function get_value( int $post_id ): string {
		return (string) get_post_meta( $post_id, '_example_value', true );
	}
}
```

Classic metabox fallback checklist:

- Add metabox only for relevant post types.
- Render a nonce with `wp_nonce_field()`.
- Check `current_user_can( 'edit_post', $post_id )`.
- Sanitize saved values and escape output.
- Do not enqueue block editor assets in Classic Editor screens.
- Document whether Classic Editor is supported, partial, or not supported.
