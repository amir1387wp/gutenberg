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
		custom: field.isValid?.custom,
	} ),
} satisfies FieldType< any >;
