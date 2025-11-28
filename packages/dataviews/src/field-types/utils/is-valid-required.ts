/**
 * Internal dependencies
 */
import type { NormalizedField } from '../../types';

export default function createIsValidRequired( constraint?: boolean ) {
	if ( [ undefined, false ].includes( constraint ) ) {
		return false;
	}

	return {
		constraint,
		validate< Item >( item: Item, field: NormalizedField< Item > ) {
			const value = field.getValue( { item } );
			return ! [ undefined, '', null ].includes( value );
		},
	};
}
