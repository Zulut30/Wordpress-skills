# Page Builder Compatibility Example

Default support should be builder-agnostic:

- shortcode fallback;
- block fallback;
- server-rendered output for SEO-relevant content;
- scoped CSS;
- no global builder selectors.

Optional Elementor adapter:

```php
add_action( 'plugins_loaded', static function () {
	if ( ! did_action( 'elementor/loaded' ) && ! defined( 'ELEMENTOR_VERSION' ) ) {
		return;
	}

	// Register Elementor-specific adapter through documented hooks.
} );
```

Optional Divi adapter:

```php
if ( class_exists( 'ET_Builder_Element', false ) ) {
	// Register Divi-specific module adapter after verifying current docs.
}
```

Do not enqueue builder assets globally. Do not depend on builder DOM internals unless there is no documented API and the risk is documented.
