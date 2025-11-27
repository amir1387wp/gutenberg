/**
 * Internal dependencies
 */
import type { Field } from '../types';
import type { FieldType } from '../types/private';
import {
	OPERATOR_CONTAINS,
	OPERATOR_IS,
	OPERATOR_IS_ALL,
	OPERATOR_IS_ANY,
	OPERATOR_IS_NONE,
	OPERATOR_IS_NOT,
	OPERATOR_IS_NOT_ALL,
	OPERATOR_NOT_CONTAINS,
	OPERATOR_STARTS_WITH,
} from '../constants';
import render from './utils/render-default';
import sort from './utils/sort-text';
import isValidRequired from './utils/is-valid-required';
import createIsValidMinLength from './utils/is-valid-min-length';
import createIsValidMaxLength from './utils/is-valid-max-length';
import createIsValidPattern from './utils/is-valid-pattern';

export default {
	type: 'text',
	render,
	Edit: 'text',
	sort,
	enableSorting: true,
	enableGlobalSearch: false,
	defaultOperators: [ OPERATOR_IS_ANY, OPERATOR_IS_NONE ],
	validOperators: [
		// Single selection
		OPERATOR_IS,
		OPERATOR_IS_NOT,
		OPERATOR_CONTAINS,
		OPERATOR_NOT_CONTAINS,
		OPERATOR_STARTS_WITH,
		// Multiple selection
		OPERATOR_IS_ANY,
		OPERATOR_IS_NONE,
		OPERATOR_IS_ALL,
		OPERATOR_IS_NOT_ALL,
	],
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
		elements: field.isValid?.elements ?? true,
		custom: field.isValid?.custom ?? ( () => null ),
	} ),
} satisfies FieldType< any >;
