<?php
/**
 * Fixture only. Shows guarded fallback SEO output.
 */

defined( 'ABSPATH' ) || exit;

function compatibility_fixture_has_seo_owner(): bool {
	return defined( 'WPSEO_VERSION' )
		|| defined( 'RANK_MATH_VERSION' )
		|| defined( 'AIOSEO_VERSION' )
		|| defined( 'SEOPRESS_VERSION' );
}

add_action(
	'wp_head',
	static function () {
		if ( compatibility_fixture_has_seo_owner() ) {
			return;
		}

		$description = apply_filters( 'compatibility_fixture_meta_description', get_bloginfo( 'description' ) );
		printf( '<meta name="description" content="%s">' . "\n", esc_attr( $description ) );
	}
);
