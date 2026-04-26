# Secure REST Route

```php
register_rest_route(
	'plugin-slug/v1',
	'/items',
	array(
		array(
			'methods'             => 'POST',
			'callback'            => array( $controller, 'create_item' ),
			'permission_callback' => static fn () => current_user_can( 'edit_posts' ),
			'args'                => array(
				'title' => array(
					'type'              => 'string',
					'required'          => true,
					'sanitize_callback' => 'sanitize_text_field',
				),
			),
		),
	)
);
```

The important parts are the capability check, argument schema, sanitization, and callback-level validation for business rules.
