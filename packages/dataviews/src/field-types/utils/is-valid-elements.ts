/**
 * Internal dependencies
 */
import type { NormalizedField } from '../../types';

/**
 * Factory for elements validation.
 * Returns a validate function that takes elements as a parameter,
 * allowing it to work for both sync and async validation paths.
 */
export default function createIsValidElements() {
	return {
		validate: function isValidElements< Item >(
			item: Item,
			field: NormalizedField< Item >,
			elements: Array< { value: any } >
		): boolean {
			const value = field.getValue( { item } );
			const validValues = elements.map( ( el ) => el.value );

			// Covers both array and non-array values.
			return []
				.concat( value )
				.every( ( v ) => validValues.includes( v ) );
		},
	};
}
