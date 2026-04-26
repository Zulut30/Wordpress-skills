# Hooks, REST, Admin, Settings, AJAX, Shortcodes

Last reviewed: 2026-04-26

## Official Sources

- Hooks: https://developer.wordpress.org/plugins/hooks/
- Actions: https://developer.wordpress.org/plugins/hooks/actions/
- Filters: https://developer.wordpress.org/plugins/hooks/filters/
- Administration Menus: https://developer.wordpress.org/plugins/administration-menus/
- `add_menu_page()`: https://developer.wordpress.org/reference/functions/add_menu_page/
- `add_submenu_page()`: https://developer.wordpress.org/reference/functions/add_submenu_page/
- Settings API: https://developer.wordpress.org/plugins/settings/settings-api/
- REST API Handbook: https://developer.wordpress.org/rest-api/
- Adding Custom Endpoints: https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/
- `register_rest_route()`: https://developer.wordpress.org/reference/functions/register_rest_route/
- AJAX: https://developer.wordpress.org/plugins/javascript/ajax/
- Shortcodes: https://developer.wordpress.org/plugins/shortcodes/
- `shortcode_atts()`: https://developer.wordpress.org/reference/functions/shortcode_atts/

## Verify Current Docs First

Verify REST route requirements, Settings API behavior, admin menu signatures, and editor/admin integration APIs before changing public APIs or release-sensitive code.

## Actions vs Filters

- `add_action( $hook, $callback, $priority, $accepted_args )`: run side effects at a WordPress lifecycle point.
- `add_filter( $hook, $callback, $priority, $accepted_args )`: receive a value, return the modified value.
- Priority: lower numbers run earlier; default is `10`. Use explicit priority only when ordering matters.
- Accepted args: set the fourth parameter when the hook passes more than one argument.
- Removing hooks: `remove_action()` / `remove_filter()` must use the same hook, callback identity, and priority.
- Custom hooks: expose stable extension points with prefixed names and documented parameters.

Action pattern:

```php
add_action( 'init', array( $registrar, 'register' ) );
```

Filter pattern:

```php
add_filter(
	'example_tools_label',
	static function ( string $label, int $post_id ): string {
		return '' !== $label ? $label : get_the_title( $post_id );
	},
	10,
	2
);
```

Custom hook pattern:

```php
/**
 * Filters the prepared card data before rendering.
 *
 * @param array $data    Prepared card data.
 * @param int   $post_id Source post ID.
 */
$data = apply_filters( 'example_tools_card_data', $data, $post_id );
```

Agent rules:

- Do not use filters for side effects.
- Avoid anonymous callbacks when another component may need to remove the hook.
- Put hook registration in one service/boot method so lifecycle is auditable.

## Admin Menus

- Register menus on `admin_menu`.
- Use `add_menu_page()` for top-level plugin areas.
- Use `add_submenu_page()` for settings/tools under an existing admin section.
- The menu capability controls visibility only; repeat capability checks in render and action handlers.
- Capture the returned screen ID and use it to load assets only on the target screen.
- Use `load-$hook_suffix` for screen-specific setup when useful.

Pattern:

```php
add_action(
	'admin_menu',
	static function (): void {
		$screen_id = add_menu_page(
			__( 'Example Tools', 'example-tools' ),
			__( 'Example Tools', 'example-tools' ),
			'manage_options',
			'example-tools',
			'example_tools_render_page',
			'dashicons-admin-tools'
		);

		add_action(
			'admin_enqueue_scripts',
			static function ( string $hook_suffix ) use ( $screen_id ): void {
				if ( $hook_suffix !== $screen_id ) {
					return;
				}

				wp_enqueue_style(
					'example-tools-admin',
					plugins_url( 'build/admin.css', EXAMPLE_TOOLS_FILE ),
					array(),
					EXAMPLE_TOOLS_VERSION
				);
			}
		);
	}
);
```

## Settings API

- Register settings on `admin_init`.
- `register_setting()` must include a `sanitize_callback` for writable options.
- Use `add_settings_section()` to group fields.
- Use `add_settings_field()` for each field renderer.
- Use `settings_fields( $group )` to output nonce and option group fields.
- Use `do_settings_sections( $page )` to render registered sections/fields.
- Escape option values in render callbacks.

Secure settings page template:

```php
add_action(
	'admin_init',
	static function (): void {
		register_setting(
			'example_tools',
			'example_tools_label',
			array(
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'default'           => '',
			)
		);

		add_settings_section(
			'example_tools_main',
			__( 'General', 'example-tools' ),
			'__return_false',
			'example-tools'
		);

		add_settings_field(
			'example_tools_label',
			__( 'Label', 'example-tools' ),
			'example_tools_render_label_field',
			'example-tools',
			'example_tools_main'
		);
	}
);

function example_tools_render_label_field(): void {
	printf(
		'<input class="regular-text" name="example_tools_label" value="%s" />',
		esc_attr( get_option( 'example_tools_label', '' ) )
	);
}

function example_tools_render_settings_page(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Permission denied.', 'example-tools' ), 403 );
	}
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		<form action="options.php" method="post">
			<?php
			settings_fields( 'example_tools' );
			do_settings_sections( 'example-tools' );
			submit_button();
			?>
		</form>
	</div>
	<?php
}
```

## REST API

- Namespace routes with plugin and version: `example-tools/v1`.
- Register routes on `rest_api_init`.
- Use explicit methods: `WP_REST_Server::READABLE`, `CREATABLE`, `EDITABLE`, `DELETABLE`, or standard method strings.
- Define `args`/schema for request data.
- Always set `permission_callback`.
- Use `__return_true` only for truly public, non-sensitive endpoints.
- Use `WP_REST_Request` for access to params, headers, files, and route data.
- Return arrays, `WP_REST_Response`, or `WP_Error`; set meaningful status codes for errors.

Secure REST controller template:

```php
use WP_Error;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

class Example_Tools_Items_Controller extends WP_REST_Controller {
	protected $namespace = 'example-tools/v1';
	protected $rest_base = 'items';

	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/(?P<id>\d+)',
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_item' ),
				'permission_callback' => array( $this, 'update_item_permissions_check' ),
				'args'                => array(
					'id'    => array(
						'type'              => 'integer',
						'required'          => true,
						'sanitize_callback' => 'absint',
					),
					'label' => array(
						'type'              => 'string',
						'required'          => true,
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);
	}

	public function update_item_permissions_check( WP_REST_Request $request ): bool {
		return current_user_can( 'edit_post', (int) $request['id'] );
	}

	public function update_item( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$post_id = absint( $request['id'] );
		$label   = sanitize_text_field( $request['label'] );

		if ( '' === $label ) {
			return new WP_Error(
				'example_tools_empty_label',
				__( 'Label is required.', 'example-tools' ),
				array( 'status' => 400 )
			);
		}

		update_post_meta( $post_id, '_example_tools_label', $label );

		return rest_ensure_response(
			array(
				'id'    => $post_id,
				'label' => $label,
			)
		);
	}
}
```

## AJAX

Use `admin-ajax.php` when:

- Existing plugin code already uses admin AJAX.
- A legacy admin screen expects it.
- The feature is small and not intended as a reusable API.

Prefer REST when:

- The endpoint is structured, versioned, editor-facing, public-facing, or reused by multiple clients.

Secure admin AJAX flow:

```php
add_action(
	'wp_ajax_example_tools_save',
	static function (): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'Permission denied.', 'example-tools' ) ), 403 );
		}

		check_ajax_referer( 'example_tools_save', 'nonce' );

		$label = sanitize_text_field( wp_unslash( $_POST['label'] ?? '' ) );
		update_option( 'example_tools_label', $label );

		wp_send_json_success( array( 'label' => $label ) );
	}
);
```

Agent rules:

- `wp_ajax_nopriv_*` is public internet traffic. Add strict validation and abuse controls.
- Do not echo partial JSON manually; use `wp_send_json_success()` / `wp_send_json_error()`.
- Pair capability checks and nonces for authenticated writes.

## Shortcodes

- Register with `add_shortcode( 'example', 'callback' )`.
- Parse attributes with `shortcode_atts()`.
- Treat shortcode attributes and enclosed content as untrusted.
- Return a string; do not echo from shortcode handlers.
- Use output buffering only when templating is complex enough to justify it.
- Escape output by context.
- Keep database queries bounded and cache expensive output when needed.

Shortcode handler template:

```php
add_shortcode( 'example_card', 'example_tools_render_card_shortcode' );

function example_tools_render_card_shortcode( array $atts = array(), ?string $content = null ): string {
	$atts = shortcode_atts(
		array(
			'id'    => 0,
			'label' => '',
		),
		$atts,
		'example_card'
	);

	$post_id = absint( $atts['id'] );
	if ( ! $post_id || ! current_user_can( 'read_post', $post_id ) ) {
		return '';
	}

	$label = '' !== $atts['label'] ? sanitize_text_field( $atts['label'] ) : get_the_title( $post_id );

	return sprintf(
		'<div class="example-tools-card"><h2>%s</h2>%s</div>',
		esc_html( $label ),
		wp_kses_post( $content ?? '' )
	);
}
```

## Decision Tree

REST vs admin-ajax:

- Need versioned API, editor integration, public read endpoint, mobile/external client, or reusable JavaScript API? Use REST.
- Maintaining a small legacy admin interaction already built on `admin-ajax.php`? Use AJAX.
- Need unauthenticated public action? Prefer REST with explicit public permission and abuse controls.
- Need authenticated admin write? Either works, but REST is preferred for new structured features.

Option vs post meta:

- Site-wide setting or feature configuration? Use option.
- Data belongs to a post/CPT item? Use post meta.
- Data must be queryable as content with admin UI, permissions, revisions, or taxonomy? Use CPT.
- High-volume relational/log data? Consider custom table.

Admin page vs block sidebar extension:

- Site/plugin configuration for administrators? Use admin page or Settings API.
- Per-post/block/editor workflow? Use block sidebar/plugin sidebar/editor extension.
- Frontend content rendering controlled by saved block attributes? Use block controls and server-side render when needed.
- Operational tools, imports, exports, diagnostics? Use admin page under Tools or plugin top-level menu.

## Review Checklist

- Hooks are registered in predictable lifecycle methods.
- Filters return values and do not perform unrelated side effects.
- Custom hooks are prefixed and documented.
- Admin pages check capability both in menu registration and render/action code.
- Admin assets load only on target screen IDs.
- Settings use `register_setting()` with `sanitize_callback`.
- REST routes use namespace/versioning, `permission_callback`, schema/args, and proper responses.
- AJAX write actions check capability and nonce.
- Shortcodes return escaped output and sanitize attributes.
- Decision between REST/AJAX, option/meta, admin/editor UI is explicit.
