/**
 * Internal dependencies
 */
import type { DataViewRenderFieldProps, Field } from '../types';
import type { FieldType } from '../types/private';
import RenderFromElements from './utils/render-from-elements';
import isValidRequired from './utils/is-valid-required';
import createIsValidMinLength from './utils/is-valid-min-length';
import createIsValidMaxLength from './utils/is-valid-max-length';
import createIsValidPattern from './utils/is-valid-pattern';
import createIsValidElements from './utils/is-valid-elements';

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
		pattern:
			field.isValid?.pattern !== undefined
				? {
						pattern: field.isValid.pattern,
						...createIsValidPattern( field.isValid.pattern ),
				  }
				: false,
		minLength:
			field.isValid?.minLength !== undefined
				? {
						value: field.isValid.minLength,
						validate: createIsValidMinLength(
							field.isValid.minLength
						),
				  }
				: false,
		maxLength:
			field.isValid?.maxLength !== undefined
				? {
						value: field.isValid.maxLength,
						validate: createIsValidMaxLength(
							field.isValid.maxLength
						),
				  }
				: false,
		elements:
			field.isValid?.elements ?? true
				? { validate: createIsValidElements() }
				: false,
		custom: field.isValid?.custom ?? ( () => null ),
	} ),
} satisfies FieldType< any >;
