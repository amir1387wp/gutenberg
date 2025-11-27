/**
 * Internal dependencies
 */
import type { NormalizedField } from '../../types';

/**
 * Factory function that creates a pattern validation function.
 * Compiles the RegExp during normalization and returns both the validation function
 * and a flag indicating whether the regex pattern itself is valid.
 *
 * @param pattern The regex pattern string
 * @return Object with isValidRegex flag and validate function
 */
export default function createIsValidPattern( pattern: string ) {
	let regex: RegExp | null = null;
	let isValidRegex = true;

	try {
		regex = new RegExp( pattern );
	} catch ( error ) {
		isValidRegex = false;
	}

	return {
		isValidRegex,
		validate: function isValidPattern< Item >(
			item: Item,
			field: NormalizedField< Item >
		): boolean {
			if ( ! isValidRegex || ! regex ) {
				return true; // Let isValidRegex flag handle this case
			}

			const value = field.getValue( { item } );

			// Empty values are considered valid for pattern validation
			// (use required validation to enforce non-empty values)
			if ( [ undefined, '', null ].includes( value ) ) {
				return true;
			}

			return regex.test( String( value ) );
		},
	};
}
