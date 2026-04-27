<?php
/**
 * Plugin Name: Compatibility Fixture Plugin
 * Description: Small fixture plugin for compatibility audit checks.
 * Version: 0.1.0
 * Requires at least: 6.5
 * Requires PHP: 8.1
 * License: MIT
 * Text Domain: compatibility-fixture
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/src/GoodIntegrationRegistry.php';
require_once __DIR__ . '/src/BadIntegrationExamples.php';
require_once __DIR__ . '/src/ClassicEditorGood.php';
require_once __DIR__ . '/src/ClassicEditorBad.php';
require_once __DIR__ . '/src/SeoGood.php';
require_once __DIR__ . '/src/SeoBad.php';
require_once __DIR__ . '/src/CacheGood.php';
require_once __DIR__ . '/src/CacheBad.php';
require_once __DIR__ . '/src/ThemeGood.php';
require_once __DIR__ . '/src/ThemeBad.php';
require_once __DIR__ . '/src/ElementorGood.php';
require_once __DIR__ . '/src/ElementorBad.php';

add_action(
	'init',
	static function () {
		register_block_type( __DIR__ . '/blocks/compatibility-block' );
	}
);
