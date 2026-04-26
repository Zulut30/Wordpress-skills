import { InspectorControls } from '@wordpress/block-editor';
import { Button, PanelBody, Placeholder, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	if ( ! attributes.configured ) {
		return (
			<Placeholder
				label={ __( 'Design Fixture', 'design-fixture' ) }
				instructions={ __( 'Configure this block before it displays content.', 'design-fixture' ) }
			>
				<Button variant="primary" onClick={ () => setAttributes( { configured: true } ) }>
					{ __( 'Configure block', 'design-fixture' ) }
				</Button>
			</Placeholder>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Display settings', 'design-fixture' ) }>
					<ToggleControl
						label={ __( 'Show details', 'design-fixture' ) }
						checked={ !! attributes.showDetails }
						onChange={ ( showDetails ) => setAttributes( { showDetails } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div>{ __( 'Good block preview', 'design-fixture' ) }</div>
		</>
	);
}
