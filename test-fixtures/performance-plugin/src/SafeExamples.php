<?php
/**
 * Safe performance examples for scanner fixture.
 */

namespace Performance_Plugin;

use WP_Query;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

defined( 'ABSPATH' ) || exit;

final class SafeExamples {
	public static function register(): void {
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_admin_assets' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
	}

	public static function enqueue_admin_assets( string $hook_suffix ): void {
		if ( 'settings_page_performance-plugin' !== $hook_suffix ) {
			return;
		}

		wp_enqueue_script(
			'performance-plugin-admin',
			plugins_url( 'build/admin.js', __DIR__ ),
			array(),
			'0.1.0',
			array( 'strategy' => 'defer' )
		);
	}

	public static function get_bounded_item_ids( int $limit = 10 ): array {
		$query = new WP_Query(
			array(
				'post_type'      => 'post',
				'post_status'    => 'publish',
				'posts_per_page' => min( 20, max( 1, absint( $limit ) ) ),
				'fields'         => 'ids',
				'no_found_rows'  => true,
			)
		);

		return array_map( 'absint', $query->posts );
	}

	public static function get_cached_titles(): array {
		$cached = get_transient( 'performance_plugin_titles' );
		if ( false !== $cached ) {
			return is_array( $cached ) ? $cached : array();
		}

		$titles = array_map( 'get_the_title', self::get_bounded_item_ids( 5 ) );
		set_transient( 'performance_plugin_titles', $titles, 5 * MINUTE_IN_SECONDS );

		return $titles;
	}

	public static function invalidate_cached_titles(): void {
		delete_transient( 'performance_plugin_titles' );
	}

	public static function register_routes(): void {
		register_rest_route(
			'performance-plugin/v1',
			'/items',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'get_items' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'page'     => array( 'sanitize_callback' => 'absint', 'default' => 1 ),
					'per_page' => array( 'sanitize_callback' => 'absint', 'default' => 10 ),
				),
			)
		);
	}

	public static function get_items( WP_REST_Request $request ): WP_REST_Response {
		$per_page = min( 20, max( 1, absint( $request['per_page'] ) ) );

		return new WP_REST_Response(
			array(
				'items' => self::get_bounded_item_ids( $per_page ),
			)
		);
	}
}

add_action( 'save_post', array( SafeExamples::class, 'invalidate_cached_titles' ) );
