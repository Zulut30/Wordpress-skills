# WordPress Security

Last reviewed: 2026-04-26

## Official Sources

- Security handbook: https://developer.wordpress.org/apis/security/
- Nonces: https://developer.wordpress.org/apis/security/nonces/
- Sanitizing data: https://developer.wordpress.org/apis/security/sanitizing/
- Escaping data: https://developer.wordpress.org/apis/security/escaping/
- Validating data: https://developer.wordpress.org/apis/security/data-validation/
- Roles and capabilities: https://developer.wordpress.org/apis/security/user-roles-and-capabilities/
- `current_user_can()`: https://developer.wordpress.org/reference/functions/current_user_can/
- `map_meta_cap()`: https://developer.wordpress.org/reference/functions/map_meta_cap/
- REST API handbook: https://developer.wordpress.org/rest-api/
- `register_rest_route()`: https://developer.wordpress.org/reference/functions/register_rest_route/
- `$wpdb->prepare()`: https://developer.wordpress.org/reference/classes/wpdb/prepare/
- `dbDelta()`: https://developer.wordpress.org/reference/functions/dbdelta/
- Filesystem API: https://developer.wordpress.org/apis/filesystem/
- `wp_check_filetype_and_ext()`: https://developer.wordpress.org/reference/functions/wp_check_filetype_and_ext/
- `wp_handle_upload()`: https://developer.wordpress.org/reference/functions/wp_handle_upload/
- HTTP API: https://developer.wordpress.org/apis/making-http-requests/
- AJAX: https://developer.wordpress.org/plugins/javascript/ajax/
- Cron: https://developer.wordpress.org/plugins/cron/

## Verify Current Docs First

Verify current security docs, REST route requirements, Plugin Check rules, upload handling, and WordPress version-specific APIs before public release or when changing security-sensitive code.

## Security Model For Agents

Every data path must answer five questions:

1. Who is the actor?
2. Is the actor allowed to do this operation?
3. Did the actor intentionally submit this browser-originated action?
4. Is the input valid for this business rule?
5. Is every output escaped for the exact context?

Do not write code until these answers are clear for admin forms, AJAX, REST routes, shortcodes, block render callbacks, cron callbacks, webhooks, uploads, filesystem operations, and direct SQL.

## Threat Model For WordPress Plugins

- XSS: unescaped request, option, meta, shortcode, block attribute, REST, or third-party data rendered into HTML/attributes/URLs/JS.
- CSRF: state-changing admin/AJAX/front-end action missing a nonce or using a generic action string.
- SQL injection: interpolated values in manual SQL or incorrect `$wpdb->prepare()` use.
- Privilege escalation: checking login only, checking a role name, using the wrong capability, or trusting client-supplied user/object IDs.
- Insecure direct object reference: acting on a post/user/order/file ID without checking the current user's permission for that exact object.
- Arbitrary file upload/delete: trusting filenames, MIME types, paths, extensions, or user-controlled directories.
- SSRF via HTTP API: fetching user-supplied URLs without scheme/host allowlisting and response limits.
- Unsafe deserialization: unserializing untrusted data or accepting serialized payloads from options, requests, webhooks, imports, or remote APIs.
- PII/secrets leakage: exposing emails, tokens, API keys, private meta, logs, debug output, or private REST fields.

## Input Handling

Validate first:

- Required field present?
- Type matches expected shape?
- Value is in an allowlist or acceptable range?
- Object exists and belongs to the expected owner/context?
- Current user can act on that object?

Sanitize before storing or processing:

- Text: `sanitize_text_field()`, `sanitize_textarea_field()`.
- Slugs/keys: `sanitize_key()`, `sanitize_title()`.
- Email: `sanitize_email()`.
- URL for storage: `esc_url_raw()`.
- Integers: `absint()` plus range checks.
- Boolean: explicit normalization with accepted values.
- HTML: `wp_kses()` with an allowlist, or `wp_kses_post()` only when post-like markup is intended.
- Arrays: sanitize recursively by schema; never store raw request arrays.

Bad:

```php
update_option( 'example_label', $_POST['label'] );
```

Good:

```php
$label = sanitize_text_field( wp_unslash( $_POST['label'] ?? '' ) );
if ( '' === $label ) {
	wp_die( esc_html__( 'Label is required.', 'example' ) );
}
update_option( 'example_label', $label );
```

## Output Handling

Escape late, at the point of output:

- HTML text node: `esc_html( $value )`.
- HTML attribute: `esc_attr( $value )`.
- URL attribute: `esc_url( $url )`.
- Intentional limited HTML: `wp_kses( $html, $allowed_html )`.
- Post-like HTML: `wp_kses_post( $html )`.
- JavaScript data: prefer `wp_json_encode()` or WordPress script data APIs.

Bad:

```php
echo '<a href="' . $url . '">' . $label . '</a>';
```

Good:

```php
printf(
	'<a href="%1$s">%2$s</a>',
	esc_url( $url ),
	esc_html( $label )
);
```

## Authorization

Use `current_user_can()` for every privileged operation:

- Settings management: usually `manage_options`, unless a narrower custom capability exists.
- Editing a post/CPT item: `current_user_can( 'edit_post', $post_id )`.
- Deleting a post/CPT item: `current_user_can( 'delete_post', $post_id )`.
- Reading private object data: object-specific read capability where available.
- Uploading files: `upload_files`, plus feature-specific capability if needed.
- Plugin/theme management: use the relevant core capability, not a role name.

Use `map_meta_cap()` when defining custom capability mapping for object-specific permissions. Prefer meta capabilities like `edit_post` with object IDs over primitive caps when an operation targets a specific object.

Bad:

```php
if ( is_user_logged_in() ) {
	delete_post_meta( (int) $_POST['post_id'], '_secret' );
}
```

Good:

```php
$post_id = absint( $_POST['post_id'] ?? 0 );
if ( ! $post_id || ! current_user_can( 'delete_post', $post_id ) ) {
	wp_die( esc_html__( 'Permission denied.', 'example' ), 403 );
}
delete_post_meta( $post_id, '_secret' );
```

## CSRF And Nonces

Nonces prove intent, not permission. Always pair nonce checks with capability checks for state changes.

- Admin forms: render with `wp_nonce_field( 'example_action', 'example_nonce' )`.
- Admin POST/GET handlers: verify with `check_admin_referer( 'example_action', 'example_nonce' )`.
- AJAX handlers: verify with `check_ajax_referer( 'example_action', 'nonce' )`.
- REST routes: rely on WordPress REST nonce behavior for cookie-authenticated requests, but still enforce `permission_callback`. If sending a custom nonce, verify it explicitly and document why.
- Use action strings that include the object ID when the action is object-specific.
- Do not protect destructive actions with GET-only URLs unless they include nonce and capability checks; POST is preferred.

## REST API

Operational rules:

- Register routes on `rest_api_init`.
- Use a namespaced route such as `example/v1`.
- Always set `permission_callback`.
- Use `__return_true` only when the endpoint exposes truly public, non-sensitive, read-only data.
- Define `args` with `type`, `required`, `sanitize_callback`, `validate_callback`, and schema where practical.
- Check object-level permissions inside the permission callback or callback before acting.
- Return `WP_REST_Response` or `WP_Error` with intentional status codes.
- Do not leak private options, tokens, emails, paths, debug data, or raw exception messages.

Bad:

```php
register_rest_route( 'example/v1', '/settings', array(
	'methods'  => 'POST',
	'callback' => 'example_save_settings',
) );
```

Good:

```php
add_action(
	'rest_api_init',
	static function (): void {
		register_rest_route(
			'example/v1',
			'/settings',
			array(
				'methods'             => 'POST',
				'callback'            => 'example_rest_save_settings',
				'permission_callback' => static fn () => current_user_can( 'manage_options' ),
				'args'                => array(
					'label' => array(
						'type'              => 'string',
						'required'          => true,
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);
	}
);
```

## Database

- Prefer WordPress APIs: Options, Metadata, Users, Posts, Terms, Comments, Transients.
- Use `$wpdb->prepare()` for every manual SQL value.
- Use placeholders matching type: `%s`, `%d`, `%f`, `%i` where supported for identifiers.
- Never interpolate request data into SQL.
- For custom tables, use `dbDelta()` in activation/migration code, maintain a schema version option, and design uninstall cleanup.
- Escape SQL results on output; database storage is not a display context.

Bad:

```php
$wpdb->get_results( "SELECT * FROM {$table} WHERE email = '$email'" );
```

Good:

```php
$rows = $wpdb->get_results(
	$wpdb->prepare( "SELECT * FROM {$table} WHERE email = %s", sanitize_email( $email ) )
);
```

## Filesystem And Uploads

- Use `WP_Filesystem` when writing files in plugin/theme/admin workflows and when host ownership may matter.
- Validate paths with `realpath()` where possible and ensure the final path stays inside the intended base directory.
- Never accept `../`, absolute paths, stream wrappers, or user-controlled delete paths.
- Use WordPress upload helpers for uploads.
- Validate upload size, extension, and actual MIME/type using WordPress functions such as `wp_check_filetype_and_ext()`.
- Store uploads under WordPress upload directories unless there is a documented reason not to.
- Do not execute uploaded files or allow PHP/HTML uploads unless the feature explicitly requires it and has strict controls.

Bad:

```php
unlink( $_POST['path'] );
```

Good:

```php
$base = realpath( wp_upload_dir()['basedir'] . '/example' );
$file = realpath( $base . '/' . sanitize_file_name( wp_unslash( $_POST['file'] ?? '' ) ) );
if ( ! $base || ! $file || ! str_starts_with( $file, $base . DIRECTORY_SEPARATOR ) ) {
	wp_die( esc_html__( 'Invalid file.', 'example' ), 400 );
}
wp_delete_file( $file );
```

## HTTP API And SSRF

- Prefer `wp_remote_get()` / `wp_remote_post()` over cURL.
- For user-provided URLs, allowlist schemes and hosts.
- Reject local/private network destinations unless explicitly intended and protected.
- Set timeouts, response size limits when possible, and expected status/content-type checks.
- Do not forward cookies, auth headers, API keys, or internal URLs to arbitrary hosts.
- Store remote errors safely; do not expose raw secrets or stack traces.

## AJAX

- Use `admin-ajax.php` for legacy admin interactions, compatibility with existing code, or simple authenticated admin actions.
- Prefer REST API for modern structured features, public APIs, editor integrations, and reusable endpoints.
- For `wp_ajax_*`: check capability and `check_ajax_referer()`.
- For `wp_ajax_nopriv_*`: treat the request as public internet traffic; add rate limits, validation, and abuse controls.
- Return with `wp_send_json_success()` or `wp_send_json_error()` and avoid echoing partial output.

## Cron And Webhooks

- Cron callbacks run without a browser nonce. Secure by design: only schedule trusted events with known args.
- Make cron jobs idempotent; repeated execution must not duplicate irreversible effects.
- For webhooks, verify signatures with a shared secret or provider public-key mechanism before parsing side effects.
- Store processed webhook IDs or event hashes to prevent replay.
- Add rate limiting or queueing for expensive inbound webhooks.
- Validate event ownership before changing local objects.

## Secure Code Snippets

### Secure admin POST handler

```php
add_action(
	'admin_post_example_save_settings',
	static function (): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Permission denied.', 'example' ), 403 );
		}

		check_admin_referer( 'example_save_settings', 'example_nonce' );

		$label = sanitize_text_field( wp_unslash( $_POST['label'] ?? '' ) );
		if ( '' === $label ) {
			wp_safe_redirect( add_query_arg( 'example_error', 'missing_label', wp_get_referer() ?: admin_url() ) );
			exit;
		}

		update_option( 'example_label', $label );
		wp_safe_redirect( add_query_arg( 'example_updated', '1', wp_get_referer() ?: admin_url() ) );
		exit;
	}
);
```

### Secure REST route

```php
add_action(
	'rest_api_init',
	static function (): void {
		register_rest_route(
			'example/v1',
			'/items/(?P<id>\d+)',
			array(
				'methods'             => 'POST',
				'callback'            => 'example_update_item',
				'permission_callback' => static function ( WP_REST_Request $request ): bool {
					return current_user_can( 'edit_post', (int) $request['id'] );
				},
				'args'                => array(
					'id'    => array(
						'type'              => 'integer',
						'required'          => true,
						'sanitize_callback' => 'absint',
					),
					'title' => array(
						'type'              => 'string',
						'required'          => true,
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);
	}
);

function example_update_item( WP_REST_Request $request ): WP_REST_Response|WP_Error {
	$post_id = absint( $request['id'] );
	$title   = sanitize_text_field( $request['title'] );

	if ( '' === $title ) {
		return new WP_Error( 'example_empty_title', __( 'Title is required.', 'example' ), array( 'status' => 400 ) );
	}

	wp_update_post(
		array(
			'ID'         => $post_id,
			'post_title' => $title,
		)
	);

	return rest_ensure_response( array( 'id' => $post_id ) );
}
```

### Secure settings registration

```php
add_action(
	'admin_init',
	static function (): void {
		register_setting(
			'example_settings',
			'example_label',
			array(
				'type'              => 'string',
				'sanitize_callback' => static function ( $value ): string {
					return sanitize_text_field( (string) $value );
				},
				'default'           => '',
			)
		);
	}
);
```

## Review Checklist

Must-fix:

- Missing capability check on privileged action.
- Missing nonce on state-changing browser/admin/AJAX action.
- REST route missing `permission_callback`.
- Private/mutating REST route using `__return_true`.
- Raw request/options/meta/remote data echoed without escaping.
- Manual SQL with interpolated values.
- Arbitrary file upload, write, read, or delete path.
- User-supplied URL fetched without SSRF controls.
- Secrets, tokens, PII, or private paths exposed in output, logs, REST, or JS.
- Unsafe `unserialize()` or object injection path from untrusted data.

Should-fix:

- Sanitization exists but validation/business-rule rejection is missing.
- Capability is too broad or not object-specific.
- Nonce action string is generic instead of object/action-specific.
- Admin assets or frontend assets load globally without need.
- Upload checks rely only on extension or client-provided MIME.
- Cron/webhook action is not idempotent.
- Error messages expose implementation details.
- Settings registered without schema/defaults.

Nice-to-have:

- Centralized permission helpers for repeated capability decisions.
- REST schema coverage for all arguments and responses.
- Security-focused unit/integration tests for permissions and invalid input.
- Rate limiting for expensive public endpoints.
- Audit logging for sensitive admin actions without storing secrets.
- Clear privacy notes for stored personal data and external services.
