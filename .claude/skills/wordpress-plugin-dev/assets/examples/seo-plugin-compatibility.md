# SEO Plugin Compatibility Example

Problem:

```php
add_action( 'wp_head', static function () {
	echo '<script type="application/ld+json">{...}</script>';
	echo '<meta name="description" content="Example" />';
} );
```

This can duplicate schema or meta tags when an SEO plugin already controls the document head.

Better approach:

```php
function example_should_output_fallback_seo(): bool {
	$seo_detected = defined( 'WPSEO_VERSION' )
		|| defined( 'RANK_MATH_VERSION' )
		|| defined( 'AIOSEO_VERSION' )
		|| defined( 'SEOPRESS_VERSION' );

	return (bool) apply_filters( 'example_should_output_fallback_seo', ! $seo_detected );
}

add_action( 'wp_head', static function () {
	if ( ! example_should_output_fallback_seo() ) {
		return;
	}

	printf(
		'<meta name="description" content="%s" />' . "\n",
		esc_attr( 'Example fallback description' )
	);
} );
```

For plugin-specific schema/meta integrations, verify current official docs and use documented hooks instead of private classes.
