# Cache Plugin Compatibility Example

## Public vs Private Output

Public cacheable:

- product/category/status cards with no user-specific data;
- static block output;
- public REST responses with bounded data.

Private or cache-sensitive:

- logged-in user name;
- account status;
- nonces;
- cart/session fragments;
- admin-only notices.

## Targeted Purge

Bad:

```php
add_action( 'init', 'rocket_clean_domain' );
```

Better:

```php
add_action( 'save_post_product', static function ( int $post_id ) {
	if ( function_exists( 'rocket_clean_post' ) ) {
		rocket_clean_post( $post_id );
	}
} );
```

## Notes

- Do not cache user-specific data publicly.
- Do not purge all cache on normal requests.
- Use standard `wp_enqueue_script()` dependencies so optimization plugins can preserve order.
- Document manual exclusions only after a real conflict is reproduced.
