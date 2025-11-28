/**
 * Internal dependencies
 */
import type { DataViewRenderFieldProps, Field, SortDirection } from '../types';
import type { FieldType } from '../types/private';
import RenderFromElements from './utils/render-from-elements';
import parseDateTime from './utils/parse-date-time';
import createIsValidElements from './utils/is-valid-elements';
import {
	OPERATOR_ON,
	OPERATOR_NOT_ON,
	OPERATOR_BEFORE,
	OPERATOR_AFTER,
	OPERATOR_BEFORE_INC,
	OPERATOR_AFTER_INC,
	OPERATOR_IN_THE_PAST,
	OPERATOR_OVER,
} from '../constants';

function render( { item, field }: DataViewRenderFieldProps< any > ) {
	if ( field.elements ) {
		return <RenderFromElements item={ item } field={ field } />;
	}

	const value = field.getValue( { item } );
	if ( [ '', undefined, null ].includes( value ) ) {
		return null;
	}

	try {
		const dateValue = parseDateTime( value );
		return dateValue?.toLocaleString();
	} catch ( error ) {
		return null;
	}
}

const sort = ( a: any, b: any, direction: SortDirection ) => {
	const timeA = new Date( a ).getTime();
	const timeB = new Date( b ).getTime();

	return direction === 'asc' ? timeA - timeB : timeB - timeA;
};

export default {
	type: 'datetime',
	render,
	Edit: 'datetime',
	sort,
	enableSorting: true,
	enableGlobalSearch: false,
	defaultOperators: [
		OPERATOR_ON,
		OPERATOR_NOT_ON,
		OPERATOR_BEFORE,
		OPERATOR_AFTER,
		OPERATOR_BEFORE_INC,
		OPERATOR_AFTER_INC,
		OPERATOR_IN_THE_PAST,
		OPERATOR_OVER,
	],
	validOperators: [
		OPERATOR_ON,
		OPERATOR_NOT_ON,
		OPERATOR_BEFORE,
		OPERATOR_AFTER,
		OPERATOR_BEFORE_INC,
		OPERATOR_AFTER_INC,
		OPERATOR_IN_THE_PAST,
		OPERATOR_OVER,
	],
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
