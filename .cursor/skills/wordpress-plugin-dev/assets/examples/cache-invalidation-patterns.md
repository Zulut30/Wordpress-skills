# Cache Invalidation Patterns

## Invalidate On `save_post`

```php
add_action(
	'save_post_event',
	static function ( int $post_id ): void {
		delete_transient( 'acme_event_list_v1' );
	}
);
```

## Invalidate On `update_option`

```php
add_action(
	'update_option_acme_settings',
	static function (): void {
		delete_transient( 'acme_settings_dependent_output_v1' );
	}
);
```

## Invalidate On `delete_post`

```php
add_action(
	'delete_post',
	static function ( int $post_id ): void {
		if ( 'event' === get_post_type( $post_id ) ) {
			delete_transient( 'acme_event_list_v1' );
		}
	}
);
```

## Avoid Stale Or Private Cache

- Include public context in cache keys.
- Do not globally cache user-specific data unless the key includes user/context and permissions are still checked.
- Use short TTLs for external API failures.
- Treat cache invalidation as part of the feature, not an afterthought.
