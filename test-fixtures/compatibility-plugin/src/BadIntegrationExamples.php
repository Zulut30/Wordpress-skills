<?php
/**
 * Fixture only. Do not copy into production.
 *
 * This file intentionally contains brittle optional dependency examples for
 * static scanner coverage. It does not run destructive behavior.
 */

defined( 'ABSPATH' ) || exit;

function compatibility_fixture_bad_direct_plugin_include(): void {
	require_once WP_PLUGIN_DIR . '/wordpress-seo/src/integrations/example-internal.php';
}

function compatibility_fixture_bad_direct_api_use(): void {
	YoastSEO();
	\Elementor\Plugin::instance();
}
