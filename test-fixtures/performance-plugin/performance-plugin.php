<?php
/**
 * Plugin Name: Performance Fixture Plugin
 * Description: Fixture plugin for testing WordPress Plugin Dev Skill performance heuristics.
 * Version: 0.1.0
 * Requires at least: 6.5
 * Requires PHP: 8.1
 * Author: Test Fixture
 * License: GPL-2.0-or-later
 * Text Domain: performance-plugin
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/src/SafeExamples.php';
require_once __DIR__ . '/src/PerformanceSmells.php';

add_action(
	'plugins_loaded',
	static function (): void {
		Performance_Plugin\SafeExamples::register();
		// Performance_Plugin\PerformanceSmells::register(); // Fixture only. Do not enable in production.
	}
);
