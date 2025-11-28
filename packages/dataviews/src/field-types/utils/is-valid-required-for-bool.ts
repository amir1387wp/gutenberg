/**
 * Internal dependencies
 */
import type { NormalizedField } from '../../types';

export default function isValidRequiredForBool( constraint?: boolean ) {
	if ( constraint === false ) {
		return undefined;
	}

	return {
		constraint,
		validate< Item >( item: Item, field: NormalizedField< Item > ) {
			const value = field.getValue( { item } );

			return value === true;
		},
	};
}
