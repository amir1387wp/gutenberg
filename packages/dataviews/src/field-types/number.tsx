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
} from '../types';
import type { FieldType } from '../types/private';
import {
	OPERATOR_IS,
	OPERATOR_IS_NOT,
	OPERATOR_LESS_THAN,
	OPERATOR_GREATER_THAN,
	OPERATOR_LESS_THAN_OR_EQUAL,
	OPERATOR_GREATER_THAN_OR_EQUAL,
	OPERATOR_IS_ANY,
	OPERATOR_IS_NONE,
	OPERATOR_IS_ALL,
	OPERATOR_IS_NOT_ALL,
	OPERATOR_BETWEEN,
} from '../constants';
import RenderFromElements from './utils/render-from-elements';
import sort from './utils/sort-number';
import isValidRequired from './utils/is-valid-required';
import createIsValidMin from './utils/is-valid-min';
import createIsValidMax from './utils/is-valid-max';
import createIsValidElements from './utils/is-valid-elements';

function isEmpty( value: unknown ): value is '' | undefined | null {
	return value === '' || value === undefined || value === null;
}

function render( { item, field }: DataViewRenderFieldProps< any > ) {
	if ( field.hasElements ) {
		return <RenderFromElements item={ item } field={ field } />;
	}

	const value = field.getValue( { item } );
	if ( ! [ null, undefined ].includes( value ) ) {
		return Number( value ).toFixed( 2 );
	}

	return null;
}

function isValidCustomFn< Item >( item: Item, field: NormalizedField< Item > ) {
	const value = field.getValue( { item } );

	if ( ! isEmpty( value ) && ! Number.isFinite( value ) ) {
		return __( 'Value must be a number.' );
	}

	return null;
}

export default {
	type: 'number',
	render,
	Edit: 'number',
	sort,
	enableSorting: true,
	enableGlobalSearch: false,
	defaultOperators: [
		OPERATOR_IS,
		OPERATOR_IS_NOT,
		OPERATOR_LESS_THAN,
		OPERATOR_GREATER_THAN,
		OPERATOR_LESS_THAN_OR_EQUAL,
		OPERATOR_GREATER_THAN_OR_EQUAL,
		OPERATOR_BETWEEN,
	],
	validOperators: [
		// Single-selection
		OPERATOR_IS,
		OPERATOR_IS_NOT,
		OPERATOR_LESS_THAN,
		OPERATOR_GREATER_THAN,
		OPERATOR_LESS_THAN_OR_EQUAL,
		OPERATOR_GREATER_THAN_OR_EQUAL,
		OPERATOR_BETWEEN,
		// Multiple-selection
		OPERATOR_IS_ANY,
		OPERATOR_IS_NONE,
		OPERATOR_IS_ALL,
		OPERATOR_IS_NOT_ALL,
	],
	getFormat: () => ( {} ),
	getIsValid: ( field: Field< any > ) => ( {
		required: field.isValid?.required ? isValidRequired : false,
		min:
			field.isValid?.min !== undefined
				? createIsValidMin( field.isValid.min )
				: false,
		max:
			field.isValid?.max !== undefined
				? createIsValidMax( field.isValid.max )
				: false,
		pattern: false,
		minLength: false,
		maxLength: false,
		elements:
			field.isValid?.elements ?? true ? createIsValidElements() : false,
		custom: field.isValid?.custom ?? isValidCustomFn,
	} ),
} satisfies FieldType< any >;
