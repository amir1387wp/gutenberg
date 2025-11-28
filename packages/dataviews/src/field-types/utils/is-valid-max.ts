/**
 * Internal dependencies
 */
import type { NormalizedField } from '../../types';

/**
 * Factory function that creates a max validation function.
 * Returns a validation function that checks if a value meets the maximum requirement.
 *
 * @param maxValue The maximum value allowed
 * @return Validation function that returns true if valid, false if invalid
 */
export default function createIsValidMax( maxValue: number ) {
	return {
		value: maxValue,
		validate: function isValidMax< Item >(
			item: Item,
			field: NormalizedField< Item >
		): boolean {
			const value = field.getValue( { item } );

			// Empty values are considered valid for max validation
			// (use required validation to enforce non-empty values)
			if ( [ undefined, '', null ].includes( value ) ) {
				return true;
			}

			return Number( value ) <= maxValue;
		},
	};
}
