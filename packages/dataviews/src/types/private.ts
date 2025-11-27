/**
 * Internal dependencies
 */
import type {
	Field,
	FormatDate,
	NormalizedField,
	NormalizedRules,
	Operator,
} from './field-api';

export type SelectionOrUpdater = string[] | ( ( prev: string[] ) => string[] );
export type SetSelection = ( selection: SelectionOrUpdater ) => void;
export type FieldType< Item > = Pick<
	NormalizedField< Item >,
	'type' | 'render' | 'sort' | 'enableSorting' | 'enableGlobalSearch'
> & {
	Edit: string | null;
	validOperators: Operator[];
	defaultOperators: Operator[];
	getFormat: (
		field: Field< Item >
	) => Record< string, any > | Required< FormatDate >;
	getIsValid: ( field: Field< Item > ) => NormalizedRules< Item >;
};
