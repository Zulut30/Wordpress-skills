# Frontend Output Design

Last reviewed: 2026-04-27

Frontend plugin output should usually look like it belongs to the active theme.

## Theme-Friendly Card Pattern

```php
<article class="example-plugin-card">
	<h2 class="example-plugin-card__title"><?php echo esc_html( $title ); ?></h2>
	<p><?php echo esc_html( $summary ); ?></p>
	<a class="example-plugin-card__link" href="<?php echo esc_url( $url ); ?>">
		<?php echo esc_html__( 'Read more', 'example-plugin' ); ?>
	</a>
</article>
```

```css
.example-plugin-card {
	max-width: 100%;
	margin-block: 1.5rem;
}

.example-plugin-card__link:focus-visible {
	outline: 2px solid currentColor;
	outline-offset: 2px;
}
```

Checklist:

- Use semantic HTML.
- Escape all output.
- Scope CSS under a wrapper/block class.
- Avoid global selectors and resets.
- Avoid hardcoded fonts by default.
- Use logical properties for RTL friendliness.
- Keep frontend JS small and load only when needed.
