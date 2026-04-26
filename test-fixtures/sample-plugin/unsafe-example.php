<?php
/**
 * Fixture-only intentionally unsafe examples for audit-plugin.mjs.
 *
 * This file is not production code. It exists so the heuristic scanner has
 * predictable findings to report. Do not copy these patterns into plugins.
 *
 * @package SampleFixturePlugin
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'rest_api_init',
	static function (): void {
		register_rest_route(
			'sample-fixture-plugin/v1',
			'/fixture-unsafe',
			array(
				'methods'  => 'GET',
				'callback' => 'sample_fixture_plugin_unsafe_rest_callback',
			)
		);
	}
);

function sample_fixture_plugin_unsafe_rest_callback(): array {
	// Fixture-only: deliberately unsanitized request access for scanner coverage.
	$name = $_GET['name'] ?? '';

	// Fixture-only: deliberately unescaped output for scanner coverage.
	echo $name;

	return array(
		'name' => $name,
	);
}
