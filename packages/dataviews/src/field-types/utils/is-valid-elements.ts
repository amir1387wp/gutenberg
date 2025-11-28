/**
 * Internal dependencies
 */
import type { NormalizedField } from '../../types';

export default function createIsValidElements( constraint?: boolean ) {
	if ( [ undefined, false ].includes( constraint ) ) {
		return undefined;
	}

	return {
		constraint,
		validate< Item >(
			item: Item,
			field: NormalizedField< Item >
		): boolean {
			const value = field.getValue( { item } );
			const elements = field.elements ?? [];
			const validValues = elements.map( ( el ) => el.value );

			// Covers both array and non-array values.
			return []
				.concat( value )
				.every( ( v ) => validValues.includes( v ) );
		},
	};
}
