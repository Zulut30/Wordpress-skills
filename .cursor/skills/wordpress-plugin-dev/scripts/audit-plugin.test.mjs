import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

import { auditPlugin, parsePluginHeaders } from './audit-plugin.mjs';

function withPlugin(files, callback) {
  const root = mkdtempSync(join(tmpdir(), 'wp-plugin-audit-'));

  try {
    for (const [file, content] of Object.entries(files)) {
      const fullPath = join(root, file);
      mkdirSync(dirname(fullPath), { recursive: true });
      writeFileSync(fullPath, content);
    }

    return callback(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('parsePluginHeaders reads WordPress plugin headers', () => {
  const headers = parsePluginHeaders(`<?php
/**
 * Plugin Name: Example Plugin
 * Version: 1.2.3
 * Text Domain: example-plugin
 * Requires at least: 6.5
 * Requires PHP: 8.1
 */
`);

  assert.equal(headers['Plugin Name'], 'Example Plugin');
  assert.equal(headers.Version, '1.2.3');
  assert.equal(headers['Text Domain'], 'example-plugin');
  assert.equal(headers['Requires at least'], '6.5');
  assert.equal(headers['Requires PHP'], '8.1');
});

test('auditPlugin detects missing REST permission callback', () => {
  withPlugin(
    {
      'example.php': `<?php
/**
 * Plugin Name: Example
 * Version: 1.0.0
 * Text Domain: example
 */
defined( 'ABSPATH' ) || exit;
add_action( 'rest_api_init', function () {
	register_rest_route( 'example/v1', '/items', array(
		'methods' => 'GET',
		'callback' => '__return_empty_array',
	) );
} );
`,
    },
    (root) => {
      const report = auditPlugin(root);
      assert.ok(report.findings.some((finding) => finding.rule === 'security.rest-route-missing-permission-callback'));
    }
  );
});

test('auditPlugin detects unsafe request and output heuristics', () => {
  withPlugin(
    {
      'example.php': `<?php
/**
 * Plugin Name: Example
 * Version: 1.0.0
 * Text Domain: example
 */
defined( 'ABSPATH' ) || exit;
$name = $_GET['name'];
echo $name;
`,
    },
    (root) => {
      const report = auditPlugin(root);
      assert.ok(report.findings.some((finding) => finding.rule === 'security.superglobal-without-nearby-sanitization'));
      assert.ok(report.findings.some((finding) => finding.rule === 'security.output-without-obvious-escaping'));
    }
  );
});

test('auditPlugin validates block metadata shape', () => {
  withPlugin(
    {
      'example.php': `<?php
/**
 * Plugin Name: Example
 * Version: 1.0.0
 * Text Domain: example
 */
defined( 'ABSPATH' ) || exit;
`,
      'blocks/example/block.json': JSON.stringify({
        apiVersion: 3,
        name: 'bad-name',
        title: 'Example',
      }),
    },
    (root) => {
      const report = auditPlugin(root);
      assert.ok(report.findings.some((finding) => finding.rule === 'blocks.invalid-name'));
      assert.ok(report.findings.some((finding) => finding.rule === 'blocks.missing-textdomain'));
    }
  );
});

test('auditPlugin detects performance heuristics only when requested', () => {
  withPlugin(
    {
      'example.php': `<?php
/**
 * Plugin Name: Example
 * Version: 1.0.0
 * Text Domain: example
 */
defined( 'ABSPATH' ) || exit;
add_action( 'init', static function () {
	flush_rewrite_rules();
	$query = new WP_Query(
		array(
			'post_type'      => 'post',
			'posts_per_page' => -1,
		)
	);
} );
`,
    },
    (root) => {
      const normalReport = auditPlugin(root);
      assert.equal(normalReport.findings.some((finding) => finding.category === 'performance'), false);

      const performanceReport = auditPlugin(root, { performance: true });
      assert.ok(
        performanceReport.findings.some(
          (finding) => finding.rule === 'performance.hooks.flush-rewrite-rules-on-request'
        )
      );
      assert.ok(performanceReport.findings.some((finding) => finding.rule === 'performance.query.unbounded-post-query'));
    }
  );
});

test('auditPlugin detects design heuristics only when requested', () => {
  withPlugin(
    {
      'example.php': `<?php
/**
 * Plugin Name: Example
 * Version: 1.0.0
 * Text Domain: example
 */
defined( 'ABSPATH' ) || exit;
add_action( 'admin_menu', static function () {
	add_menu_page( 'Example', 'Example', 'manage_options', 'example', 'example_render_page' );
} );
function example_render_page() {
	?>
	<form method="post">
		<input type="text" name="example_name" placeholder="Name" />
		<button type="submit">Submit</button>
	</form>
	<?php
}
`,
      'assets/bad-admin.css': `body {
	color: #111;
}
.example button:focus {
	outline: none;
}
`,
    },
    (root) => {
      const normalReport = auditPlugin(root);
      assert.equal(normalReport.findings.some((finding) => finding.category === 'design'), false);

      const designReport = auditPlugin(root, { design: true });
      assert.ok(designReport.findings.some((finding) => finding.rule === 'design.admin.form-without-obvious-nonce-flow'));
      assert.ok(designReport.findings.some((finding) => finding.rule === 'design.forms.placeholder-used-as-label'));
      assert.ok(designReport.findings.some((finding) => finding.rule === 'design.admin.global-css-selector'));
    }
  );
});

test('auditPlugin detects compatibility heuristics only when requested', () => {
  withPlugin(
    {
      'example.php': `<?php
/**
 * Plugin Name: Example
 * Version: 1.0.0
 * Text Domain: example
 */
defined( 'ABSPATH' ) || exit;
add_action( 'wp_head', static function () {
	echo '<meta name="description" content="Fixture">';
	echo '<script type="application/ld+json">{}</script>';
} );
add_action( 'init', static function () {
	rocket_clean_domain();
} );
function example_register_elementor() {
	\\Elementor\\Plugin::instance();
}
`,
      'assets/frontend.css': `body {
	margin: 0;
}
.elementor-widget-example {
	color: red !important;
}
`,
    },
    (root) => {
      const normalReport = auditPlugin(root);
      assert.equal(normalReport.findings.some((finding) => finding.category === 'compatibility'), false);

      const compatibilityReport = auditPlugin(root, { compatibility: true });
      assert.ok(
        compatibilityReport.findings.some(
          (finding) => finding.rule === 'compatibility.seo.unconditional-head-output'
        )
      );
      assert.ok(
        compatibilityReport.findings.some(
          (finding) => finding.rule === 'compatibility.cache.purge-all-on-request'
        )
      );
      assert.ok(
        compatibilityReport.findings.some(
          (finding) => finding.rule === 'compatibility.builder.unguarded-builder-reference'
        )
      );
      assert.ok(
        compatibilityReport.findings.some((finding) => finding.rule === 'compatibility.theme.global-frontend-css')
      );
    }
  );
});
