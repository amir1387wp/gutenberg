/**
 * Internal dependencies
 */
import type { Field, SortDirection } from '../types';
import type { FieldType } from '../types/private';
import { ALL_OPERATORS, OPERATOR_IS, OPERATOR_IS_NOT } from '../constants';
import render from './utils/render-default';
import sortText from './utils/sort-text';
import sortNumber from './utils/sort-number';
import isValidRequired from './utils/is-valid-required';
import isValidElements from './utils/is-valid-elements';

const sort = ( a: any, b: any, direction: SortDirection ) => {
	if ( typeof a === 'number' && typeof b === 'number' ) {
		return sortNumber( a, b, direction );
	}

	return sortText( a, b, direction );
};

export default {
	// type: no type for this one
	render,
	Edit: null,
	sort,
	enableSorting: true,
	enableGlobalSearch: false,
	defaultOperators: [ OPERATOR_IS, OPERATOR_IS_NOT ],
	validOperators: ALL_OPERATORS,
	getFormat: () => ( {} ),
	getIsValid: ( field: Field< any > ) => ( {
		required: isValidRequired( field.isValid?.required ),
		min: false,
		max: false,
		pattern: false,
		minLength: false,
		maxLength: false,
		elements: isValidElements( field.isValid?.elements ?? true ),
		custom: field.isValid?.custom ?? ( () => null ),
	} ),
} satisfies FieldType< any >;
