<?php
/**
 * Fixture only. Do not copy into production.
 *
 * This file intentionally contains inefficient patterns for static scanner tests.
 */

namespace Performance_Plugin;

use WP_Query;

defined( 'ABSPATH' ) || exit;

final class PerformanceSmells {
	public static function register(): void {
		add_action( 'init', array( __CLASS__, 'flush_rewrites_on_request' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'global_admin_assets' ) );
		add_action( 'wp', array( __CLASS__, 'remote_call_on_frontend' ) );
		add_action( 'performance_plugin_cron', array( __CLASS__, 'cron_without_batching' ) );
	}

	public static function flush_rewrites_on_request(): void {
		flush_rewrite_rules();
	}

	public static function global_admin_assets(): void {
		wp_enqueue_script( 'performance-plugin-global-admin', plugins_url( 'global-admin.js', __DIR__ ) );
	}

	public static function query_all_posts(): array {
		$query = new WP_Query(
			array(
				'post_type'      => 'post',
				'posts_per_page' => -1,
			)
		);

		return $query->posts;
	}

	public static function set_cache_without_ttl(): void {
		set_transient( 'performance_plugin_no_ttl', array( 'fixture' => true ) );
	}

	public static function remote_call_on_frontend(): void {
		wp_remote_get( 'https://example.com/status' );
	}

	public static function query_inside_loop( array $post_ids ): void {
		foreach ( $post_ids as $post_id ) {
			new WP_Query(
				array(
					'p'              => absint( $post_id ),
					'post_type'      => 'post',
					'posts_per_page' => 1,
				)
			);
		}
	}

	public static function direct_sql_without_limit(): array {
		global $wpdb;

		return $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$wpdb->posts} WHERE post_type = %s",
				'post'
			)
		);
	}

	public static function cron_without_batching(): void {
		self::query_all_posts();
	}
}
