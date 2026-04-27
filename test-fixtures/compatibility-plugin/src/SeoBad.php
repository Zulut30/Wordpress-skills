<?php
/**
 * Fixture only. Do not copy into production.
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'wp_head',
	static function () {
		echo '<title>Fixture title</title>';
		echo '<link rel="canonical" href="https://example.test/fixture">';
		echo '<meta name="description" content="Duplicate fixture description">';
		echo '<meta property="og:title" content="Fixture">';
		echo '<script type="application/ld+json">{"@context":"https://schema.org"}</script>';
	}
);
