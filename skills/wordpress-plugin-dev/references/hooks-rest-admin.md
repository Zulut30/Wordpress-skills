# Hooks, REST, Admin UI, CPTs, Taxonomies

Last reviewed: 2026-04-26

## Official Sources

- Hooks: https://developer.wordpress.org/plugins/hooks/
- Actions: https://developer.wordpress.org/plugins/hooks/actions/
- Filters: https://developer.wordpress.org/plugins/hooks/filters/
- REST API Handbook: https://developer.wordpress.org/rest-api/
- Adding custom endpoints: https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/
- Administration menus: https://developer.wordpress.org/plugins/administration-menus/
- Settings API: https://developer.wordpress.org/plugins/settings/settings-api/
- Custom post types: https://developer.wordpress.org/plugins/post-types/
- Taxonomies: https://developer.wordpress.org/plugins/taxonomies/

## Verify Current Docs First

Verify REST endpoint behavior and Settings API examples when supporting newer WordPress versions or strict Plugin Check rules.

## Hooks

- Register hooks in one boot method so lifecycle is easy to inspect.
- Use actions for side effects and filters for transforming values.
- Prefix custom hook names: `plugin_slug_event_name`.
- Document custom hooks near the `do_action()` or `apply_filters()` call.
- Avoid anonymous callbacks when removal or testing may be needed.

## REST API

- Register routes on `rest_api_init`.
- Use a namespace such as `plugin-slug/v1`.
- Provide `methods`, `callback`, `permission_callback`, `args`, and schema where practical.
- Validate and sanitize route args with callbacks or schema.
- Return `WP_REST_Response`, arrays, or `WP_Error`; set status codes intentionally.
- Use controller classes for multiple endpoints or shared permissions.

## Admin UI And Settings

- Register menus on `admin_menu`.
- Register settings, sections, and fields on `admin_init`.
- Capability-gate the page and form submission.
- Use `settings_fields()`, `do_settings_sections()`, and `submit_button()` for Settings API pages.
- Escape all option values when rendering fields.
- Use admin notices sparingly and make them dismissible when persistent.

## CPTs And Taxonomies

- Register on `init`.
- Set labels, capabilities, REST visibility, rewrite behavior, and supports deliberately.
- Flush rewrite rules only on activation/deactivation after registering the CPT/taxonomy.
- Prefer custom capabilities for editorial workflows that differ from posts.
