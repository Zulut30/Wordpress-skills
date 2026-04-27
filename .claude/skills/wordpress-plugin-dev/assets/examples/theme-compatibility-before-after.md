# Theme Compatibility Before / After

Bad:

```css
body {
	font-family: Arial, sans-serif;
}

h1,
button {
	margin-left: 40px !important;
	width: 720px;
}
```

Problems:

- overrides the active theme globally;
- makes RTL harder;
- fixed widths can break mobile layouts;
- `!important` fights themes and builders.

Better:

```html
<section class="example-plugin-card" aria-labelledby="example-plugin-card-title">
	<h2 id="example-plugin-card-title">Example title</h2>
	<p>Theme-friendly content.</p>
</section>
```

```css
.example-plugin-card {
	max-inline-size: 48rem;
	margin-block: 1.5rem;
}

.example-plugin-card__action {
	display: inline-flex;
	gap: 0.5rem;
}
```

Use generic WordPress/theme-friendly markup before adding theme-specific adapters.
