/**
 * Internal dependencies
 */
import type { NormalizedField } from '../../types';

/**
 * Factory function that creates a minLength validation function.
 * Returns a validation function that checks if a value meets the minimum length requirement.
 *
 * @param minLength The minimum length allowed
 * @return Validation function that returns true if valid, false if invalid
 */
export default function createIsValidMinLength( minLength: number ) {
	return function isValidMinLength< Item >(
		item: Item,
		field: NormalizedField< Item >
	): boolean {
		const value = field.getValue( { item } );

		// Empty values are considered valid for minLength validation
		// (use required validation to enforce non-empty values)
		if ( [ undefined, '', null ].includes( value ) ) {
			return true;
		}

		return String( value ).length >= minLength;
	};
}
