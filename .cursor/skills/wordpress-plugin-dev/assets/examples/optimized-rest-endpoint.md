# Optimized REST Endpoint

## Before

```php
register_rest_route(
	'acme/v1',
	'/items',
	array(
		'methods'             => 'GET',
		'callback'            => static function () {
			return get_posts(
				array(
					'post_type'      => 'acme_item',
					'posts_per_page' => -1,
				)
			);
		},
		'permission_callback' => '__return_true',
	)
);
```

Problems: unbounded response, full objects, no response shape control.

## After

```php
register_rest_route(
	'acme/v1',
	'/items',
	array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => static function ( WP_REST_Request $request ) {
			$per_page = min( 50, max( 1, absint( $request['per_page'] ?? 10 ) ) );
			$page     = max( 1, absint( $request['page'] ?? 1 ) );

			$query = new WP_Query(
				array(
					'post_type'      => 'acme_item',
					'post_status'    => 'publish',
					'posts_per_page' => $per_page,
					'paged'          => $page,
					'fields'         => 'ids',
				)
			);

			return rest_ensure_response(
				array_map(
					static fn ( int $id ): array => array(
						'id'    => $id,
						'title' => get_the_title( $id ),
					),
					array_map( 'absint', $query->posts )
				)
			);
		},
		'args'                => array(
			'page'     => array( 'sanitize_callback' => 'absint', 'default' => 1 ),
			'per_page' => array( 'sanitize_callback' => 'absint', 'default' => 10 ),
		),
	)
);
```

Keep `permission_callback` even when the endpoint is public.
