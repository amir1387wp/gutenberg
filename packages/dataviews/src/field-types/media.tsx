/**
 * Internal dependencies
 */
import type { Field } from '../types';
import type { FieldType } from '../types/private';
import createIsValidElements from './utils/is-valid-elements';

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
		required: field.isValid?.required ? () => true : false,
		min: false,
		max: false,
		pattern: false,
		minLength: false,
		maxLength: false,
		elements:
			field.isValid?.elements ?? true
				? { validate: createIsValidElements() }
				: false,
		custom: field.isValid?.custom ?? ( () => null ),
	} ),
} satisfies FieldType< any >;
