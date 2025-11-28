/**
 * Internal dependencies
 */
import type { NormalizedField } from '../../types';

export default function isValidElements< Item >(
	item: Item,
	field: NormalizedField< Item >,
	elements: Array< { value: any } >
): boolean {
	const value = field.getValue( { item } );
	const validValues = elements.map( ( el ) => el.value );

	// Covers both array and non-array values.
	return [].concat( value ).every( ( v ) => validValues.includes( v ) );
}
