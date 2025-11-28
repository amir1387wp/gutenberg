/**
 * Internal dependencies
 */
import type { Field } from '../types';
import type { FieldType } from '../types/private';
import {
	OPERATOR_IS,
	OPERATOR_IS_ALL,
	OPERATOR_IS_NOT_ALL,
	OPERATOR_IS_ANY,
	OPERATOR_IS_NONE,
	OPERATOR_IS_NOT,
	OPERATOR_CONTAINS,
	OPERATOR_NOT_CONTAINS,
	OPERATOR_STARTS_WITH,
} from '../constants';
import render from './utils/render-default';
import sort from './utils/sort-text';
import isValidRequired from './utils/is-valid-required';
import createIsValidMinLength from './utils/is-valid-min-length';
import createIsValidMaxLength from './utils/is-valid-max-length';
import createIsValidPattern from './utils/is-valid-pattern';
import createIsValidElements from './utils/is-valid-elements';

export default {
	type: 'url',
	render,
	Edit: 'url',
	sort,
	enableSorting: true,
	enableGlobalSearch: false,
	defaultOperators: [ OPERATOR_IS_ANY, OPERATOR_IS_NONE ],
	validOperators: [
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
				? createIsValidPattern( field.isValid.pattern )
				: false,
		minLength:
			field.isValid?.minLength !== undefined
				? createIsValidMinLength( field.isValid.minLength )
				: false,
		maxLength:
			field.isValid?.maxLength !== undefined
				? createIsValidMaxLength( field.isValid.maxLength )
				: false,
		elements:
			field.isValid?.elements ?? true
				? { validate: createIsValidElements() }
				: false,
		custom: field.isValid?.custom ?? ( () => null ),
	} ),
} satisfies FieldType< any >;
