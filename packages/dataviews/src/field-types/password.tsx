/**
 * Internal dependencies
 */
import type { DataViewRenderFieldProps, Field } from '../types';
import type { FieldType } from '../types/private';
import RenderFromElements from './utils/render-from-elements';
import isValidRequired from './utils/is-valid-required';

function render( { item, field }: DataViewRenderFieldProps< any > ) {
	return field.hasElements ? (
		<RenderFromElements item={ item } field={ field } />
	) : (
		'••••••••'
	);
}

export default {
	type: 'password',
	render,
	Edit: 'password',
	sort: () => 0, // Passwords should not be sortable for security reasons
	enableSorting: false,
	enableGlobalSearch: false,
	defaultOperators: [],
	validOperators: [],
	getFormat: () => ( {} ),
	getIsValid: ( field: Field< any > ) => ( {
		required: field.isValid?.required ? isValidRequired : false,
		min: false,
		max: false,
		pattern: field.isValid?.pattern,
		minLength: field.isValid?.minLength,
		maxLength: field.isValid?.maxLength,
		elements: field.isValid?.elements ?? true,
		custom: field.isValid?.custom ?? ( () => null ),
	} ),
} satisfies FieldType< any >;
