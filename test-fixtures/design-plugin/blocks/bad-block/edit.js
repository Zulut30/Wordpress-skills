/**
 * Fixture only. Do not copy into production.
 */
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, TextControl, ToggleControl, ToolbarButton } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	return (
		<>
			<InspectorControls>
				<PanelBody title="Everything">
					<TextControl value={ attributes.one } onChange={ ( one ) => setAttributes( { one } ) } />
					<TextControl value={ attributes.two } onChange={ ( two ) => setAttributes( { two } ) } />
					<SelectControl value={ attributes.three } options={ [] } onChange={ ( three ) => setAttributes( { three } ) } />
					<ToggleControl checked={ attributes.four } onChange={ ( four ) => setAttributes( { four } ) } />
					<RangeControl value={ attributes.five } onChange={ ( five ) => setAttributes( { five } ) } />
					<TextControl label="Hardcoded setting" value={ attributes.six } onChange={ ( six ) => setAttributes( { six } ) } />
					<TextControl value={ attributes.seven } onChange={ ( seven ) => setAttributes( { seven } ) } />
					<TextControl value={ attributes.eight } onChange={ ( eight ) => setAttributes( { eight } ) } />
					<TextControl value={ attributes.nine } onChange={ ( nine ) => setAttributes( { nine } ) } />
					<ToggleControl checked={ attributes.ten } onChange={ ( ten ) => setAttributes( { ten } ) } />
				</PanelBody>
			</InspectorControls>
			<ToolbarButton icon="admin-generic" onClick={ () => {} } />
			<button onClick={ () => {} }></button>
			<div>Configure things in the sidebar</div>
		</>
	);
}
