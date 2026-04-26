# Admin Settings Before/After

Last reviewed: 2026-04-27

## Before

Problems:

- One huge ungrouped form.
- Vague labels such as "Key" and "Mode".
- Placeholder-only inputs.
- No visible save status.
- Errors appear at the top with no field association.
- No capability/nonce flow is visible.
- Admin CSS styles broad selectors.

```php
echo '<form><input placeholder="Key"><button>Submit</button></form>';
```

## After

Pattern:

- `.wrap` container.
- Clear page title and description.
- Settings grouped by task.
- `settings_fields()` and `do_settings_sections()`.
- Labels connected to inputs.
- Help text describes consequences.
- `settings_errors()` or a scoped notice after save.
- Escaped output and i18n-ready text.

```php
?>
<div class="wrap example-plugin-admin">
	<h1><?php echo esc_html__( 'Example Plugin Settings', 'example-plugin' ); ?></h1>
	<p class="description"><?php echo esc_html__( 'Configure how the plugin connects and displays content.', 'example-plugin' ); ?></p>
	<?php settings_errors( 'example_plugin_messages' ); ?>
	<form method="post" action="options.php">
		<?php
		settings_fields( 'example_plugin_general' );
		do_settings_sections( 'example-plugin' );
		submit_button( __( 'Save settings', 'example-plugin' ) );
		?>
	</form>
</div>
<?php
```

Review reminders:

- Keep sanitize callbacks in `register_setting()`.
- Do not use placeholder text as a label.
- Add field-level errors with `aria-describedby` for custom validation.
- Scope admin CSS under the plugin root class.
