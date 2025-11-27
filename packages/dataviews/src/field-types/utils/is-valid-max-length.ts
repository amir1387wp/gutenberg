/**
 * Internal dependencies
 */
import type { NormalizedField } from '../../types';

/**
 * Factory function that creates a maxLength validation function.
 * Returns a validation function that checks if a value meets the maximum length requirement.
 *
 * @param maxLength The maximum length allowed
 * @return Validation function that returns true if valid, false if invalid
 */
export default function createIsValidMaxLength( maxLength: number ) {
	return function isValidMaxLength< Item >(
		item: Item,
		field: NormalizedField< Item >
	): boolean {
		const value = field.getValue( { item } );

		// Empty values are considered valid for maxLength validation
		// (use required validation to enforce non-empty values)
		if ( [ undefined, '', null ].includes( value ) ) {
			return true;
		}

		return String( value ).length <= maxLength;
	};
}
