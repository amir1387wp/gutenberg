/**
 * Internal dependencies
 */
import type { Field } from '../types';
import type { FieldType } from '../types/private';

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
		required: false,
		min: false,
		max: false,
		pattern: false,
		minLength: false,
		maxLength: false,
		elements: false,
		custom: field.isValid?.custom ?? false,
	} ),
} satisfies FieldType< any >;
