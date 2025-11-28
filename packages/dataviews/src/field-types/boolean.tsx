/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type {
	DataViewRenderFieldProps,
	Field,
	NormalizedField,
	SortDirection,
} from '../types';
import type { FieldType } from '../types/private';
import RenderFromElements from './utils/render-from-elements';
import { OPERATOR_IS, OPERATOR_IS_NOT } from '../constants';
import createIsValidElements from './utils/is-valid-elements';

function render( { item, field }: DataViewRenderFieldProps< any > ) {
	if ( field.hasElements ) {
		return <RenderFromElements item={ item } field={ field } />;
	}

	if ( field.getValue( { item } ) === true ) {
		return __( 'True' );
	}

	if ( field.getValue( { item } ) === false ) {
		return __( 'False' );
	}

	return null;
}

function isValidRequiredFn( value: any ) {
	return value === true;
}

function isValidCustomFn< Item >( item: Item, field: NormalizedField< Item > ) {
	const value = field.getValue( { item } );

	if (
		! [ undefined, '', null ].includes( value ) &&
		! [ true, false ].includes( value )
	) {
		return __( 'Value must be true, false, or undefined' );
	}

	return null;
}

const sort = ( a: any, b: any, direction: SortDirection ) => {
	const boolA = Boolean( a );
	const boolB = Boolean( b );

	if ( boolA === boolB ) {
		return 0;
	}

	// In ascending order, false comes before true
	if ( direction === 'asc' ) {
		return boolA ? 1 : -1;
	}

	// In descending order, true comes before false
	return boolA ? -1 : 1;
};

export default {
	type: 'boolean',
	render,
	Edit: 'checkbox',
	sort,
	getIsValid: ( field: Field< any > ) => ( {
		required: field?.isValid?.required ? isValidRequiredFn : false,
		min: false,
		max: false,
		pattern: false,
		minLength: false,
		maxLength: false,
		elements:
			field.isValid?.elements ?? true ? createIsValidElements() : false,
		custom: field.isValid?.custom ?? isValidCustomFn,
	} ),
	enableSorting: true,
	enableGlobalSearch: false,
	defaultOperators: [ OPERATOR_IS, OPERATOR_IS_NOT ],
	validOperators: [ OPERATOR_IS, OPERATOR_IS_NOT ],
	getFormat: () => ( {} ),
} satisfies FieldType< any >;
