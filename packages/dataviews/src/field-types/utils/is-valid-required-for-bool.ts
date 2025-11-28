/**
 * Internal dependencies
 */
import type { NormalizedField } from '../../types';

export default function isValidRequiredForBool( constraint?: boolean ) {
	if ( [ undefined, false ].includes( constraint ) ) {
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
