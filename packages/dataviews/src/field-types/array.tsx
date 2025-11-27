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
import {
	OPERATOR_IS_ALL,
	OPERATOR_IS_ANY,
	OPERATOR_IS_NONE,
	OPERATOR_IS_NOT_ALL,
} from '../constants';
import isValidRequiredArray from './utils/is-valid-required-array';

function render( { item, field }: DataViewRenderFieldProps< any > ) {
	const value = field.getValue( { item } ) || [];
	return value.join( ', ' );
}

function isValidCustomFn< Item >( item: Item, field: NormalizedField< Item > ) {
	const value = field.getValue( { item } );

	if (
		! [ undefined, '', null ].includes( value ) &&
		! Array.isArray( value )
	) {
		return __( 'Value must be an array.' );
	}

	// Only allow strings for now. Can be extended to other types in the future.
	if ( ! value.every( ( v: any ) => typeof v === 'string' ) ) {
		return __( 'Every value must be a string.' );
	}

	return null;
}

const sort = ( a: any, b: any, direction: SortDirection ) => {
	// Sort arrays by length, then alphabetically by joined string
	const arrA = Array.isArray( a ) ? a : [];
	const arrB = Array.isArray( b ) ? b : [];
	if ( arrA.length !== arrB.length ) {
		return direction === 'asc'
			? arrA.length - arrB.length
			: arrB.length - arrA.length;
	}

	const joinedA = arrA.join( ',' );
	const joinedB = arrB.join( ',' );
	return direction === 'asc'
		? joinedA.localeCompare( joinedB )
		: joinedB.localeCompare( joinedA );
};

export default {
	type: 'array',
	render,
	Edit: 'array',
	sort,
	enableSorting: true,
	enableGlobalSearch: false,
	defaultOperators: [ OPERATOR_IS_ANY, OPERATOR_IS_NONE ],
	validOperators: [
		OPERATOR_IS_ANY,
		OPERATOR_IS_NONE,
		OPERATOR_IS_ALL,
		OPERATOR_IS_NOT_ALL,
	],
	getFormat: () => ( {} ),
	getIsValid: ( field: Field< any > ) => ( {
		required: field.isValid?.required ? isValidRequiredArray : false,
		elements: field.isValid?.elements ?? true,
		custom: field.isValid?.custom ?? isValidCustomFn,
	} ),
} satisfies FieldType< any >;
