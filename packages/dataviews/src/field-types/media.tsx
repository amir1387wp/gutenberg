/**
 * Internal dependencies
 */
import type { Field } from '../types';
import type { FieldType } from '../types/private';
import isValidElements from './utils/is-valid-elements';
import isValidRequiredNoop from './utils/is-valid-required-noop';

export default {
	type: 'media',
	render: () => null,
	Edit: null,
	sort: () => 0,
	enableSorting: false,
	enableGlobalSearch: false,
	defaultOperators: [],
	validOperators: [],
	getFormat: () => ( {} ),
	getIsValid: ( field: Field< any > ) => ( {
		required: isValidRequiredNoop( field.isValid?.required ),
		min: false,
		max: false,
		pattern: false,
		minLength: false,
		maxLength: false,
		elements: isValidElements( field.isValid?.elements ?? true ),
		custom: field.isValid?.custom ?? ( () => null ),
	} ),
} satisfies FieldType< any >;
