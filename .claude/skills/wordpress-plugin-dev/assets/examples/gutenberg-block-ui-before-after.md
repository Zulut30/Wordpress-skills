# Gutenberg Block UI Before/After

Last reviewed: 2026-04-27

## Before

Symptoms:

- Every setting is in one long InspectorControls panel.
- Block canvas is blank until configured.
- Controls use hardcoded English strings.
- Toolbar buttons are icon-only without accessible labels.
- Frontend output differs from editor preview.

```js
<InspectorControls>
	<PanelBody title="Settings">
		<TextControl value={ title } onChange={ ... } />
		{/* many unrelated controls */}
	</PanelBody>
</InspectorControls>
```

## After

Pattern:

- Canvas shows the primary content and a helpful Placeholder when setup is missing.
- Toolbar contains only high-frequency contextual actions.
- InspectorControls contains advanced settings grouped into short panels.
- Controls have labels and i18n.
- Editor preview matches frontend shape without loading heavy frontend-only code.

```js
<Placeholder
	label={ __( 'Featured Items', 'example-plugin' ) }
	instructions={ __( 'Choose a source before this block displays items.', 'example-plugin' ) }
>
	<Button variant="primary" onClick={ openSettings }>
		{ __( 'Choose source', 'example-plugin' ) }
	</Button>
</Placeholder>
```

Review reminders:

- Use block supports instead of custom controls when possible.
- Keep block selected/unselected states stable.
- Test narrow editor viewports.
- Use `@wordpress/a11y` for meaningful async status updates.
