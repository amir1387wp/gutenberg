/**
 * Internal dependencies
 */
import type { NormalizedField } from '../../types';

/**
 * Factory function that creates a min validation function.
 * Returns a validation function that checks if a value meets the minimum requirement.
 *
 * @param minValue The minimum value allowed
 * @return Validation function that returns true if valid, false if invalid
 */
export default function createIsValidMin( minValue: number ) {
	return function isValidMin< Item >(
		item: Item,
		field: NormalizedField< Item >
	): boolean {
		const value = field.getValue( { item } );

		// Empty values are considered valid for min validation
		// (use required validation to enforce non-empty values)
		if ( [ undefined, '', null ].includes( value ) ) {
			return true;
		}

		return Number( value ) >= minValue;
	};
}
