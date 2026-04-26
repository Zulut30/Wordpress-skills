<?php
/**
 * Safe REST controller for fixture testing.
 *
 * @package SampleFixturePlugin
 */

namespace SampleFixturePlugin\Rest;

use WP_Error;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

defined( 'ABSPATH' ) || exit;

final class Safe_Controller extends WP_REST_Controller {
	protected $namespace = 'sample-fixture-plugin/v1';
	protected $rest_base = 'message';

	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'can_read' ),
					'args'                => array(
						'id' => array(
							'type'              => 'integer',
							'default'           => 0,
							'minimum'           => 0,
							'sanitize_callback' => 'absint',
							'validate_callback' => 'rest_validate_request_arg',
						),
					),
				),
			)
		);
	}

	/**
	 * @return true|WP_Error
	 */
	public function can_read( WP_REST_Request $request ) {
		if ( ! current_user_can( 'read' ) ) {
			return new WP_Error(
				'sample_fixture_forbidden',
				__( 'You are not allowed to read this fixture endpoint.', 'sample-fixture-plugin' ),
				array( 'status' => rest_authorization_required_code() )
			);
		}

		return true;
	}

	public function get_item( WP_REST_Request $request ): WP_REST_Response {
		$id = absint( $request->get_param( 'id' ) );

		return rest_ensure_response(
			array(
				'id'      => $id,
				'message' => get_option( 'sample_fixture_plugin_message', '' ),
			)
		);
	}
}
