<?php
/**
 * Demo REST controller.
 *
 * @package DemoSkillPlugin
 */

namespace DemoSkillPlugin\Rest;

use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;

class Demo_Controller extends WP_REST_Controller {
	protected $namespace = 'demo-skill-plugin/v1';
	protected $rest_base = 'message';

	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => 'GET',
					'callback'            => array( $this, 'get_item' ),
					'permission_callback' => array( $this, 'can_read' ),
				),
			)
		);
	}

	public function can_read( WP_REST_Request $request ): bool {
		return current_user_can( 'read' );
	}

	public function get_item( WP_REST_Request $request ): WP_REST_Response {
		return rest_ensure_response(
			array(
				'message' => get_option( 'demo_skill_plugin_message', '' ),
			)
		);
	}
}
