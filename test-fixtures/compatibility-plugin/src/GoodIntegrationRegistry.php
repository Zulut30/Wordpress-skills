<?php
/**
 * Fixture only. Shows optional adapter registration.
 */

namespace CompatibilityFixture;

defined( 'ABSPATH' ) || exit;

interface Integration_Interface {
	public function get_name(): string;

	public function detect(): bool;

	public function register(): void;

	public function get_status(): string;
}

final class Good_Integration_Registry {
	/** @var Integration_Interface[] */
	private array $adapters = array();

	public function add( Integration_Interface $adapter ): void {
		$this->adapters[] = $adapter;
	}

	public function register_available(): void {
		foreach ( $this->adapters as $adapter ) {
			if ( ! $adapter->detect() ) {
				continue;
			}

			$adapter->register();
		}
	}
}

final class Yoast_Example_Adapter implements Integration_Interface {
	public function get_name(): string {
		return 'Yoast SEO';
	}

	public function detect(): bool {
		return defined( 'WPSEO_VERSION' ) || function_exists( 'YoastSEO' );
	}

	public function register(): void {
		add_filter( 'compatibility_fixture_seo_title', array( $this, 'filter_title' ) );
	}

	public function get_status(): string {
		return 'experimental';
	}

	public function filter_title( string $title ): string {
		return $title;
	}
}
