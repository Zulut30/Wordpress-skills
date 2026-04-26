# Admin Settings Page

```php
add_action( 'admin_init', array( $settings_page, 'register_settings' ) );
add_action( 'admin_menu', array( $settings_page, 'add_page' ) );
```

Review points:

- Menu capability matches the data being managed.
- Option has a sanitize callback.
- Render method checks capability.
- Field values are escaped with `esc_attr()` or `esc_html()`.
- Form uses `settings_fields()`.
